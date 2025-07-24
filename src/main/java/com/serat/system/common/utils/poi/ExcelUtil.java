package com.serat.system.common.utils.poi;

import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import com.serat.system.common.annotation.Excel.Type;
import com.serat.system.common.annotation.Excels;
import com.serat.system.common.config.SeratSystemConfig;
import com.serat.system.common.core.domain.AjaxResult;
import com.serat.system.common.core.text.Convert;
import com.serat.system.common.exception.UtilException;
import com.serat.system.common.utils.DateUtils;
import com.serat.system.common.utils.DictUtils;
import com.serat.system.common.utils.StringUtils;
import com.serat.system.common.utils.file.FileTypeUtils;
import com.serat.system.common.utils.file.FileUtils;
import com.serat.system.common.utils.file.ImageUtils;
import com.serat.system.common.utils.reflect.ReflectUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.RegExUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ooxml.POIXMLDocumentPart;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.*;
import org.openxmlformats.schemas.drawingml.x2006.spreadsheetDrawing.CTMarker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class ExcelUtil<T>
{
    private static final Logger log = LoggerFactory.getLogger(ExcelUtil.class);

    public static final String FORMULA_REGEX_STR = "=|-|\\+|@";

    public static final String[] FORMULA_STR = { "=", "-", "+", "@" };

    public Map<String, String> sysDictMap = new HashMap<String, String>();

    public static final int sheetSize = 65536;

    private String sheetName;

    private Type type;

    private Workbook wb;

    private Sheet sheet;

    private Map<String, CellStyle> styles;

    private List<T> list;

    private List<Object[]> fields;

    private int rownum;

    private String title;

    private short maxHeight;

    private int subMergedLastRowNum = 0;

    private int subMergedFirstRowNum = 1;

    private Method subMethod;

    private List<Field> subFields;

    private Map<Integer, Double> statistics = new HashMap<Integer, Double>();

    private static final DecimalFormat DOUBLE_FORMAT = new DecimalFormat("######0.00");

    public Class<T> clazz;

    public String[] excludeFields;

    public ExcelUtil(Class<T> clazz)
    {
        this.clazz = clazz;
    }

    public void hideColumn(String... fields)
    {
        this.excludeFields = fields;
    }

    public void init(List<T> list, String sheetName, String title, Type type)
    {
        if (list == null)
        {
            list = new ArrayList<T>();
        }
        this.list = list;
        this.sheetName = sheetName;
        this.type = type;
        this.title = title;
        createExcelField();
        createWorkbook();
        createTitle();
        createSubHead();
    }

    public void createTitle()
    {
        if (StringUtils.isNotEmpty(title))
        {
            subMergedFirstRowNum++;
            subMergedLastRowNum++;
            int titleLastCol = this.fields.size() - 1;
            if (isSubList())
            {
                titleLastCol = titleLastCol + subFields.size() - 1;
            }
            Row titleRow = sheet.createRow(rownum == 0 ? rownum++ : 0);
            titleRow.setHeightInPoints(30);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellStyle(styles.get("title"));
            titleCell.setCellValue(title);
            sheet.addMergedRegion(new CellRangeAddress(titleRow.getRowNum(), titleRow.getRowNum(), titleRow.getRowNum(), titleLastCol));
        }
    }
    public void createSubHead()
    {
        if (isSubList())
        {
            subMergedFirstRowNum++;
            subMergedLastRowNum++;
            Row subRow = sheet.createRow(rownum);
            int excelNum = 0;
            for (Object[] objects : fields)
            {
                Excel attr = (Excel) objects[1];
                Cell headCell1 = subRow.createCell(excelNum);
                headCell1.setCellValue(attr.name());
                headCell1.setCellStyle(styles.get(StringUtils.format("header_{}_{}", attr.headerColor(), attr.headerBackgroundColor())));
                excelNum++;
            }
            int headFirstRow = excelNum - 1;
            int headLastRow = headFirstRow + subFields.size() - 1;
            if (headLastRow > headFirstRow)
            {
                sheet.addMergedRegion(new CellRangeAddress(rownum, rownum, headFirstRow, headLastRow));
            }
            rownum++;
        }
    }

    public List<T> importExcel(InputStream is)
    {
        List<T> list = null;
        try
        {
            list = importExcel(is, 0);
        }
        catch (Exception e)
        {
            log.error("Error occurred while importing Excel {}", e.getMessage());
            throw new UtilException(e.getMessage());
        }
        finally
        {
            IOUtils.closeQuietly(is);
        }
        return list;
    }

    public List<T> importExcel(InputStream is, int titleNum) throws Exception
    {
        return importExcel(StringUtils.EMPTY, is, titleNum);
    }

    public List<T> importExcel(String sheetName, InputStream is, int titleNum) throws Exception
    {
        this.type = Type.IMPORT;
        this.wb = WorkbookFactory.create(is);
        List<T> list = new ArrayList<T>();
        Sheet sheet = StringUtils.isNotEmpty(sheetName) ? wb.getSheet(sheetName) : wb.getSheetAt(0);
        if (sheet == null)
        {
            throw new IOException("The file sheet does not exist");
        }
        boolean isXSSFWorkbook = !(wb instanceof HSSFWorkbook);
        Map<String, PictureData> pictures;
        if (isXSSFWorkbook)
        {
            pictures = getSheetPictures07((XSSFSheet) sheet, (XSSFWorkbook) wb);
        }
        else
        {
            pictures = getSheetPictures03((HSSFSheet) sheet, (HSSFWorkbook) wb);
        }
        int rows = sheet.getLastRowNum();
        if (rows > 0)
        {
            Map<String, Integer> cellMap = new HashMap<String, Integer>();
            Row heard = sheet.getRow(titleNum);
            for (int i = 0; i < heard.getPhysicalNumberOfCells(); i++)
            {
                Cell cell = heard.getCell(i);
                if (StringUtils.isNotNull(cell))
                {
                    String value = this.getCellValue(heard, i).toString();
                    cellMap.put(value, i);
                }
                else
                {
                    cellMap.put(null, i);
                }
            }
            List<Object[]> fields = this.getFields();
            Map<Integer, Object[]> fieldsMap = new HashMap<Integer, Object[]>();
            for (Object[] objects : fields)
            {
                Excel attr = (Excel) objects[1];
                Integer column = cellMap.get(attr.name());
                if (column != null)
                {
                    fieldsMap.put(column, objects);
                }
            }
            for (int i = titleNum + 1; i <= rows; i++)
            {
                Row row = sheet.getRow(i);
                if (isRowEmpty(row))
                {
                    continue;
                }
                T entity = null;
                for (Map.Entry<Integer, Object[]> entry : fieldsMap.entrySet())
                {
                    Object val = this.getCellValue(row, entry.getKey());

                    entity = (entity == null ? clazz.newInstance() : entity);
                    Field field = (Field) entry.getValue()[0];
                    Excel attr = (Excel) entry.getValue()[1];
                    Class<?> fieldType = field.getType();
                    if (String.class == fieldType)
                    {
                        String s = Convert.toStr(val);
                        if (StringUtils.endsWith(s, ".0"))
                        {
                            val = StringUtils.substringBefore(s, ".0");
                        }
                        else
                        {
                            String dateFormat = field.getAnnotation(Excel.class).dateFormat();
                            if (StringUtils.isNotEmpty(dateFormat))
                            {
                                val = parseDateToStr(dateFormat, val);
                            }
                            else
                            {
                                val = Convert.toStr(val);
                            }
                        }
                    }
                    else if ((Integer.TYPE == fieldType || Integer.class == fieldType) && StringUtils.isNumeric(Convert.toStr(val)))
                    {
                        val = Convert.toInt(val);
                    }
                    else if ((Long.TYPE == fieldType || Long.class == fieldType) && StringUtils.isNumeric(Convert.toStr(val)))
                    {
                        val = Convert.toLong(val);
                    }
                    else if (Double.TYPE == fieldType || Double.class == fieldType)
                    {
                        val = Convert.toDouble(val);
                    }
                    else if (Float.TYPE == fieldType || Float.class == fieldType)
                    {
                        val = Convert.toFloat(val);
                    }
                    else if (BigDecimal.class == fieldType)
                    {
                        val = Convert.toBigDecimal(val);
                    }
                    else if (Date.class == fieldType)
                    {
                        if (val instanceof String)
                        {
                            val = DateUtils.parseDate(val);
                        }
                        else if (val instanceof Double)
                        {
                            val = DateUtil.getJavaDate((Double) val);
                        }
                    }
                    else if (Boolean.TYPE == fieldType || Boolean.class == fieldType)
                    {
                        val = Convert.toBool(val, false);
                    }
                    if (StringUtils.isNotNull(fieldType))
                    {
                        String propertyName = field.getName();
                        if (StringUtils.isNotEmpty(attr.targetAttr()))
                        {
                            propertyName = field.getName() + "." + attr.targetAttr();
                        }
                        if (StringUtils.isNotEmpty(attr.readConverterExp()))
                        {
                            val = reverseByExp(Convert.toStr(val), attr.readConverterExp(), attr.separator());
                        }
                        else if (StringUtils.isNotEmpty(attr.dictType()))
                        {
                            if (!sysDictMap.containsKey(attr.dictType() + val))
                            {
                                String dictValue = reverseDictByExp(Convert.toStr(val), attr.dictType(), attr.separator());
                                sysDictMap.put(attr.dictType() + val, dictValue);
                            }
                            val = sysDictMap.get(attr.dictType() + val);
                        }
                        else if (!attr.handler().equals(ExcelHandlerAdapter.class))
                        {
                            val = dataFormatHandlerAdapter(val, attr, null);
                        }
                        else if (ColumnType.IMAGE == attr.cellType() && StringUtils.isNotEmpty(pictures))
                        {
                            PictureData image = pictures.get(row.getRowNum() + "_" + entry.getKey());
                            if (image == null)
                            {
                                val = "";
                            }
                            else
                            {
                                byte[] data = image.getData();
                                val = FileUtils.writeImportBytes(data);
                            }
                        }
                        ReflectUtils.invokeSetter(entity, propertyName, val);
                    }
                }
                list.add(entity);
            }
        }
        return list;
    }
    public AjaxResult exportExcel(List<T> list, String sheetName)
    {
        return exportExcel(list, sheetName, StringUtils.EMPTY);
    }
    public AjaxResult exportExcel(List<T> list, String sheetName, String title)
    {
        this.init(list, sheetName, title, Type.EXPORT);
        return exportExcel();
    }

    public void exportExcel(HttpServletResponse response, List<T> list, String sheetName)
    {
        exportExcel(response, list, sheetName, StringUtils.EMPTY);
    }

    public void exportExcel(HttpServletResponse response, List<T> list, String sheetName, String title)
    {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        this.init(list, sheetName, title, Type.EXPORT);
        exportExcel(response);
    }

    public AjaxResult importTemplateExcel(String sheetName)
    {
        return importTemplateExcel(sheetName, StringUtils.EMPTY);
    }

    public AjaxResult importTemplateExcel(String sheetName, String title)
    {
        this.init(null, sheetName, title, Type.IMPORT);
        return exportExcel();
    }
    public void importTemplateExcel(HttpServletResponse response, String sheetName)
    {
        importTemplateExcel(response, sheetName, StringUtils.EMPTY);
    }

    public void importTemplateExcel(HttpServletResponse response, String sheetName, String title)
    {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        this.init(null, sheetName, title, Type.IMPORT);
        exportExcel(response);
    }

    public void exportExcel(HttpServletResponse response)
    {
        try
        {
            writeSheet();
            wb.write(response.getOutputStream());
        }
        catch (Exception e)
        {
            log.error("Error occurred while exporting Excel {}", e.getMessage());
        }
        finally
        {
            IOUtils.closeQuietly(wb);
        }
    }

    public AjaxResult exportExcel()
    {
        OutputStream out = null;
        try
        {
            writeSheet();
            String filename = encodingFilename(sheetName);
            out = new FileOutputStream(getAbsoluteFile(filename));
            wb.write(out);
            return AjaxResult.success(filename);
        }
        catch (Exception e)
        {
            log.error("Error occurred while exporting Excel {}", e.getMessage());
            throw new UtilException("Excel export failed, please contact the website administrator!");
        }
        finally
        {
            IOUtils.closeQuietly(wb);
            IOUtils.closeQuietly(out);
        }
    }

    public void writeSheet()
    {
        int sheetNo = Math.max(1, (int) Math.ceil(list.size() * 1.0 / sheetSize));
        for (int index = 0; index < sheetNo; index++)
        {
            createSheet(sheetNo, index);

            Row row = sheet.createRow(rownum);
            int column = 0;
            for (Object[] os : fields)
            {
                Field field = (Field) os[0];
                Excel excel = (Excel) os[1];
                if (Collection.class.isAssignableFrom(field.getType()))
                {
                    for (Field subField : subFields)
                    {
                        Excel subExcel = subField.getAnnotation(Excel.class);
                        this.createHeadCell(subExcel, row, column++);
                    }
                }
                else
                {
                    this.createHeadCell(excel, row, column++);
                }
            }
            if (Type.EXPORT.equals(type))
            {
                fillExcelData(index, row);
                addStatisticsRow();
            }
        }
    }

    @SuppressWarnings("unchecked")
    public void fillExcelData(int index, Row row)
    {
        int startNo = index * sheetSize;
        int endNo = Math.min(startNo + sheetSize, list.size());
        int rowNo = (1 + rownum) - startNo;
        for (int i = startNo; i < endNo; i++)
        {
            rowNo = isSubList() ? (i > 1 ? rowNo + 1 : rowNo + i) : i + 1 + rownum - startNo;
            row = sheet.createRow(rowNo);
            T vo = (T) list.get(i);
            Collection<?> subList = null;
            if (isSubList())
            {
                if (isSubListValue(vo))
                {
                    subList = getListCellValue(vo);
                    subMergedLastRowNum = subMergedLastRowNum + subList.size();
                }
                else
                {
                    subMergedFirstRowNum++;
                    subMergedLastRowNum++;
                }
            }
            int column = 0;
            for (Object[] os : fields)
            {
                Field field = (Field) os[0];
                Excel excel = (Excel) os[1];
                if (Collection.class.isAssignableFrom(field.getType()) && StringUtils.isNotNull(subList))
                {
                    boolean subFirst = false;
                    for (Object obj : subList)
                    {
                        if (subFirst)
                        {
                            rowNo++;
                            row = sheet.createRow(rowNo);
                        }
                        List<Field> subFields = FieldUtils.getFieldsListWithAnnotation(obj.getClass(), Excel.class);
                        int subIndex = 0;
                        for (Field subField : subFields)
                        {
                            if (subField.isAnnotationPresent(Excel.class))
                            {
                                subField.setAccessible(true);
                                Excel attr = subField.getAnnotation(Excel.class);
                                this.addCell(attr, row, (T) obj, subField, column + subIndex);
                            }
                            subIndex++;
                        }
                        subFirst = true;
                    }
                    this.subMergedFirstRowNum = this.subMergedFirstRowNum + subList.size();
                }
                else
                {
                    this.addCell(excel, row, vo, field, column++);
                }
            }
        }
    }

    private Map<String, CellStyle> createStyles(Workbook wb)
    {
        Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
        CellStyle style = wb.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        Font titleFont = wb.createFont();
        titleFont.setFontName("Arial");
        titleFont.setFontHeightInPoints((short) 16);
        titleFont.setBold(true);
        style.setFont(titleFont);
        DataFormat dataFormat = wb.createDataFormat();
        style.setDataFormat(dataFormat.getFormat("@"));
        styles.put("title", style);

        style = wb.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderRight(BorderStyle.THIN);
        style.setRightBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setBorderLeft(BorderStyle.THIN);
        style.setLeftBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setBorderTop(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setBorderBottom(BorderStyle.THIN);
        style.setBottomBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
        Font dataFont = wb.createFont();
        dataFont.setFontName("Arial");
        dataFont.setFontHeightInPoints((short) 10);
        style.setFont(dataFont);
        styles.put("data", style);

        style = wb.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        Font totalFont = wb.createFont();
        totalFont.setFontName("Arial");
        totalFont.setFontHeightInPoints((short) 10);
        style.setFont(totalFont);
        styles.put("total", style);

        styles.putAll(annotationHeaderStyles(wb, styles));

        styles.putAll(annotationDataStyles(wb));

        return styles;
    }

    private Map<String, CellStyle> annotationHeaderStyles(Workbook wb, Map<String, CellStyle> styles)
    {
        Map<String, CellStyle> headerStyles = new HashMap<String, CellStyle>();
        for (Object[] os : fields)
        {
            Excel excel = (Excel) os[1];
            String key = StringUtils.format("header_{}_{}", excel.headerColor(), excel.headerBackgroundColor());
            if (!headerStyles.containsKey(key))
            {
                CellStyle style = wb.createCellStyle();
                style.cloneStyleFrom(styles.get("data"));
                style.setAlignment(HorizontalAlignment.CENTER);
                style.setVerticalAlignment(VerticalAlignment.CENTER);
                style.setFillForegroundColor(excel.headerBackgroundColor().index);
                style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                Font headerFont = wb.createFont();
                headerFont.setFontName("Arial");
                headerFont.setFontHeightInPoints((short) 10);
                headerFont.setBold(true);
                headerFont.setColor(excel.headerColor().index);
                style.setFont(headerFont);
                DataFormat dataFormat = wb.createDataFormat();
                style.setDataFormat(dataFormat.getFormat("@"));
                headerStyles.put(key, style);
            }
        }
        return headerStyles;
    }

    private Map<String, CellStyle> annotationDataStyles(Workbook wb)
    {
        Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
        for (Object[] os : fields)
        {
            Field field = (Field) os[0];
            Excel excel = (Excel) os[1];
            if (Collection.class.isAssignableFrom(field.getType()))
            {
                ParameterizedType pt = (ParameterizedType) field.getGenericType();
                Class<?> subClass = (Class<?>) pt.getActualTypeArguments()[0];
                List<Field> subFields = FieldUtils.getFieldsListWithAnnotation(subClass, Excel.class);
                for (Field subField : subFields)
                {
                    Excel subExcel = subField.getAnnotation(Excel.class);
                    annotationDataStyles(styles, subField, subExcel);
                }
            }
            else
            {
                annotationDataStyles(styles, field, excel);
            }
        }
        return styles;
    }

    public void annotationDataStyles(Map<String, CellStyle> styles, Field field, Excel excel)
    {
        String key = StringUtils.format("data_{}_{}_{}_{}", excel.align(), excel.color(), excel.backgroundColor(), excel.cellType());
        if (!styles.containsKey(key))
        {
            CellStyle style = wb.createCellStyle();
            style.setAlignment(excel.align());
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            style.setBorderRight(BorderStyle.THIN);
            style.setRightBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
            style.setBorderLeft(BorderStyle.THIN);
            style.setLeftBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
            style.setBorderTop(BorderStyle.THIN);
            style.setTopBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
            style.setBorderBottom(BorderStyle.THIN);
            style.setBottomBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setFillForegroundColor(excel.backgroundColor().getIndex());
            Font dataFont = wb.createFont();
            dataFont.setFontName("Arial");
            dataFont.setFontHeightInPoints((short) 10);
            dataFont.setColor(excel.color().index);
            style.setFont(dataFont);
            if (ColumnType.TEXT == excel.cellType())
            {
                DataFormat dataFormat = wb.createDataFormat();
                style.setDataFormat(dataFormat.getFormat("@"));
            }
            styles.put(key, style);
        }
    }

    public Cell createHeadCell(Excel attr, Row row, int column)
    {
        Cell cell = row.createCell(column);
        cell.setCellValue(attr.name());
        setDataValidation(attr, row, column);
        cell.setCellStyle(styles.get(StringUtils.format("header_{}_{}", attr.headerColor(), attr.headerBackgroundColor())));
        if (isSubList())
        {
            sheet.setDefaultColumnStyle(column, styles.get(StringUtils.format("data_{}_{}_{}_{}", attr.align(), attr.color(), attr.backgroundColor(), attr.cellType())));
            if (attr.needMerge())
            {
                sheet.addMergedRegion(new CellRangeAddress(rownum - 1, rownum, column, column));
            }
        }
        return cell;
    }

    public void setCellVo(Object value, Excel attr, Cell cell)
    {
        if (ColumnType.STRING == attr.cellType() || ColumnType.TEXT == attr.cellType())
        {
            String cellValue = Convert.toStr(value);
            if (StringUtils.startsWithAny(cellValue, FORMULA_STR))
            {
                cellValue = RegExUtils.replaceFirst(cellValue, FORMULA_REGEX_STR, "\t$0");
            }
            if (value instanceof Collection && StringUtils.equals("[]", cellValue))
            {
                cellValue = StringUtils.EMPTY;
            }
            cell.setCellValue(StringUtils.isNull(cellValue) ? attr.defaultValue() : cellValue + attr.suffix());
        }
        else if (ColumnType.NUMERIC == attr.cellType())
        {
            if (StringUtils.isNotNull(value))
            {
                cell.setCellValue(StringUtils.contains(Convert.toStr(value), ".") ? Convert.toDouble(value) : Convert.toInt(value));
            }
        }
        else if (ColumnType.IMAGE == attr.cellType())
        {
            ClientAnchor anchor = new XSSFClientAnchor(0, 0, 0, 0, (short) cell.getColumnIndex(), cell.getRow().getRowNum(), (short) (cell.getColumnIndex() + 1), cell.getRow().getRowNum() + 1);
            String imagePath = Convert.toStr(value);
            if (StringUtils.isNotEmpty(imagePath))
            {
                byte[] data = ImageUtils.getImage(imagePath);
                getDrawingPatriarch(cell.getSheet()).createPicture(anchor,
                        cell.getSheet().getWorkbook().addPicture(data, getImageType(data)));
            }
        }
    }

    public static Drawing<?> getDrawingPatriarch(Sheet sheet)
    {
        if (sheet.getDrawingPatriarch() == null)
        {
            sheet.createDrawingPatriarch();
        }
        return sheet.getDrawingPatriarch();
    }

    public int getImageType(byte[] value)
    {
        String type = FileTypeUtils.getFileExtendName(value);
        if ("JPG".equalsIgnoreCase(type))
        {
            return Workbook.PICTURE_TYPE_JPEG;
        }
        else if ("PNG".equalsIgnoreCase(type))
        {
            return Workbook.PICTURE_TYPE_PNG;
        }
        return Workbook.PICTURE_TYPE_JPEG;
    }

    public void setDataValidation(Excel attr, Row row, int column)
    {
        if (attr.name().indexOf("Note:") >= 0)
        {
            sheet.setColumnWidth(column, 6000);
        }
        else
        {
            sheet.setColumnWidth(column, (int) ((attr.width() + 0.72) * 256));
        }
        if (StringUtils.isNotEmpty(attr.prompt()) || attr.combo().length > 0 || attr.comboReadDict())
        {
            String[] comboArray = attr.combo();
            if (attr.comboReadDict())
            {
                if (!sysDictMap.containsKey("combo_" + attr.dictType()))
                {
                    String labels = DictUtils.getDictLabels(attr.dictType());
                    sysDictMap.put("combo_" + attr.dictType(), labels);
                }
                String val = sysDictMap.get("combo_" + attr.dictType());
                comboArray = StringUtils.split(val, DictUtils.SEPARATOR);
            }
            if (comboArray.length > 15 || StringUtils.join(comboArray).length() > 255)
            {
                setXSSFValidationWithHidden(sheet, comboArray, attr.prompt(), 1, 100, column, column);
            }
            else
            {
                setPromptOrValidation(sheet, comboArray, attr.prompt(), 1, 100, column, column);
            }
        }
    }

    public Cell addCell(Excel attr, Row row, T vo, Field field, int column)
    {
        Cell cell = null;
        try
        {
            row.setHeight(maxHeight);
            if (attr.isExport())
            {
                cell = row.createCell(column);
                if (isSubListValue(vo) && getListCellValue(vo).size() > 1 && attr.needMerge())
                {
                    CellRangeAddress cellAddress = new CellRangeAddress(subMergedFirstRowNum, subMergedLastRowNum, column, column);
                    sheet.addMergedRegion(cellAddress);
                }
                cell.setCellStyle(styles.get(StringUtils.format("data_{}_{}_{}_{}", attr.align(), attr.color(), attr.backgroundColor(), attr.cellType())));

                Object value = getTargetValue(vo, field, attr);
                String dateFormat = attr.dateFormat();
                String readConverterExp = attr.readConverterExp();
                String separator = attr.separator();
                String dictType = attr.dictType();
                if (StringUtils.isNotEmpty(dateFormat) && StringUtils.isNotNull(value))
                {
                    cell.setCellValue(parseDateToStr(dateFormat, value));
                }
                else if (StringUtils.isNotEmpty(readConverterExp) && StringUtils.isNotNull(value))
                {
                    cell.setCellValue(convertByExp(Convert.toStr(value), readConverterExp, separator));
                }
                else if (StringUtils.isNotEmpty(dictType) && StringUtils.isNotNull(value))
                {
                    if (!sysDictMap.containsKey(dictType + value))
                    {
                        String lable = convertDictByExp(Convert.toStr(value), dictType, separator);
                        sysDictMap.put(dictType + value, lable);
                    }
                    cell.setCellValue(sysDictMap.get(dictType + value));
                }
                else if (value instanceof BigDecimal && -1 != attr.scale())
                {
                    cell.setCellValue((((BigDecimal) value).setScale(attr.scale(), attr.roundingMode())).doubleValue());
                }
                else if (!attr.handler().equals(ExcelHandlerAdapter.class))
                {
                    cell.setCellValue(dataFormatHandlerAdapter(value, attr, cell));
                }
                else
                {
                    setCellVo(value, attr, cell);
                }
                addStatisticsData(column, Convert.toStr(value), attr);
            }
        }
        catch (Exception e)
        {
            log.error("Excel export failed {}", e);
        }
        return cell;
    }

    public void setPromptOrValidation(Sheet sheet, String[] textlist, String promptContent, int firstRow, int endRow,
            int firstCol, int endCol)
    {
        DataValidationHelper helper = sheet.getDataValidationHelper();
        DataValidationConstraint constraint = textlist.length > 0 ? helper.createExplicitListConstraint(textlist) : helper.createCustomConstraint("DD1");
        CellRangeAddressList regions = new CellRangeAddressList(firstRow, endRow, firstCol, endCol);
        DataValidation dataValidation = helper.createValidation(constraint, regions);
        if (StringUtils.isNotEmpty(promptContent))
        {
            dataValidation.createPromptBox("", promptContent);
            dataValidation.setShowPromptBox(true);
        }
        if (dataValidation instanceof XSSFDataValidation)
        {
            dataValidation.setSuppressDropDownArrow(true);
            dataValidation.setShowErrorBox(true);
        }
        else
        {
            dataValidation.setSuppressDropDownArrow(false);
        }
        sheet.addValidationData(dataValidation);
    }

    public void setXSSFValidationWithHidden(Sheet sheet, String[] textlist, String promptContent, int firstRow, int endRow, int firstCol, int endCol)
    {
        String hideSheetName = "combo_" + firstCol + "_" + endCol;
        Sheet hideSheet = wb.createSheet(hideSheetName);
        for (int i = 0; i < textlist.length; i++)
        {
            hideSheet.createRow(i).createCell(0).setCellValue(textlist[i]);
        }
        Name name = wb.createName();
        name.setNameName(hideSheetName + "_data");
        name.setRefersToFormula(hideSheetName + "!$A$1:$A$" + textlist.length);
        DataValidationHelper helper = sheet.getDataValidationHelper();
        DataValidationConstraint constraint = helper.createFormulaListConstraint(hideSheetName + "_data");
        CellRangeAddressList regions = new CellRangeAddressList(firstRow, endRow, firstCol, endCol);
        DataValidation dataValidation = helper.createValidation(constraint, regions);
        if (StringUtils.isNotEmpty(promptContent))
        {
            dataValidation.createPromptBox("", promptContent);
            dataValidation.setShowPromptBox(true);
        }
        if (dataValidation instanceof XSSFDataValidation)
        {
            dataValidation.setSuppressDropDownArrow(true);
            dataValidation.setShowErrorBox(true);
        }
        else
        {
            dataValidation.setSuppressDropDownArrow(false);
        }

        sheet.addValidationData(dataValidation);
        wb.setSheetHidden(wb.getSheetIndex(hideSheet), true);
    }

    public static String convertByExp(String propertyValue, String converterExp, String separator)
    {
        StringBuilder propertyString = new StringBuilder();
        String[] convertSource = converterExp.split(",");
        for (String item : convertSource)
        {
            String[] itemArray = item.split("=");
            if (StringUtils.containsAny(propertyValue, separator))
            {
                for (String value : propertyValue.split(separator))
                {
                    if (itemArray[0].equals(value))
                    {
                        propertyString.append(itemArray[1] + separator);
                        break;
                    }
                }
            }
            else
            {
                if (itemArray[0].equals(propertyValue))
                {
                    return itemArray[1];
                }
            }
        }
        return StringUtils.stripEnd(propertyString.toString(), separator);
    }

    public static String reverseByExp(String propertyValue, String converterExp, String separator)
    {
        StringBuilder propertyString = new StringBuilder();
        String[] convertSource = converterExp.split(",");
        for (String item : convertSource)
        {
            String[] itemArray = item.split("=");
            if (StringUtils.containsAny(propertyValue, separator))
            {
                for (String value : propertyValue.split(separator))
                {
                    if (itemArray[1].equals(value))
                    {
                        propertyString.append(itemArray[0] + separator);
                        break;
                    }
                }
            }
            else
            {
                if (itemArray[1].equals(propertyValue))
                {
                    return itemArray[0];
                }
            }
        }
        return StringUtils.stripEnd(propertyString.toString(), separator);
    }

    public static String convertDictByExp(String dictValue, String dictType, String separator)
    {
        return DictUtils.getDictLabel(dictType, dictValue, separator);
    }

    public static String reverseDictByExp(String dictLabel, String dictType, String separator)
    {
        return DictUtils.getDictValue(dictType, dictLabel, separator);
    }

    public String dataFormatHandlerAdapter(Object value, Excel excel, Cell cell)
    {
        try
        {
            Object instance = excel.handler().newInstance();
            Method formatMethod = excel.handler().getMethod("format", new Class[] { Object.class, String[].class, Cell.class, Workbook.class });
            value = formatMethod.invoke(instance, value, excel.args(), cell, this.wb);
        }
        catch (Exception e)
        {
            log.error("Unable to format data " + excel.handler(), e.getMessage());        }
        return Convert.toStr(value);
    }

    private void addStatisticsData(Integer index, String text, Excel entity)
    {
        if (entity != null && entity.isStatistics())
        {
            Double temp = 0D;
            if (!statistics.containsKey(index))
            {
                statistics.put(index, temp);
            }
            try
            {
                temp = Double.valueOf(text);
            }
            catch (NumberFormatException e)
            {
            }
            statistics.put(index, statistics.get(index) + temp);
        }
    }

    public void addStatisticsRow()
    {
        if (statistics.size() > 0)
        {
            Row row = sheet.createRow(sheet.getLastRowNum() + 1);
            Set<Integer> keys = statistics.keySet();
            Cell cell = row.createCell(0);
            cell.setCellStyle(styles.get("total"));
            cell.setCellValue("Total");
            for (Integer key : keys)
            {
                cell = row.createCell(key);
                cell.setCellStyle(styles.get("total"));
                cell.setCellValue(DOUBLE_FORMAT.format(statistics.get(key)));
            }
            statistics.clear();
        }
    }

    public String encodingFilename(String filename)
    {
        filename = UUID.randomUUID() + "_" + filename + ".xlsx";
        return filename;
    }

    public String getAbsoluteFile(String filename)
    {
        String downloadPath = SeratSystemConfig.getDownloadPath() + filename;
        File desc = new File(downloadPath);
        if (!desc.getParentFile().exists())
        {
            desc.getParentFile().mkdirs();
        }
        return downloadPath;
    }

    private Object getTargetValue(T vo, Field field, Excel excel) throws Exception
    {
        Object o = field.get(vo);
        if (StringUtils.isNotEmpty(excel.targetAttr()))
        {
            String target = excel.targetAttr();
            if (target.contains("."))
            {
                String[] targets = target.split("[.]");
                for (String name : targets)
                {
                    o = getValue(o, name);
                }
            }
            else
            {
                o = getValue(o, target);
            }
        }
        return o;
    }

    private Object getValue(Object o, String name) throws Exception
    {
        if (StringUtils.isNotNull(o) && StringUtils.isNotEmpty(name))
        {
            Class<?> clazz = o.getClass();
            Field field = clazz.getDeclaredField(name);
            field.setAccessible(true);
            o = field.get(o);
        }
        return o;
    }

    private void createExcelField()
    {
        this.fields = getFields();
        this.fields = this.fields.stream().sorted(Comparator.comparing(objects -> ((Excel) objects[1]).sort())).collect(Collectors.toList());
        this.maxHeight = getRowHeight();
    }

    public List<Object[]> getFields()
    {
        List<Object[]> fields = new ArrayList<Object[]>();
        List<Field> tempFields = new ArrayList<>();
        tempFields.addAll(Arrays.asList(clazz.getSuperclass().getDeclaredFields()));
        tempFields.addAll(Arrays.asList(clazz.getDeclaredFields()));
        for (Field field : tempFields)
        {
            if (!ArrayUtils.contains(this.excludeFields, field.getName()))
            {
                if (field.isAnnotationPresent(Excel.class))
                {
                    Excel attr = field.getAnnotation(Excel.class);
                    if (attr != null && (attr.type() == Type.ALL || attr.type() == type))
                    {
                        field.setAccessible(true);
                        fields.add(new Object[] { field, attr });
                    }
                    if (Collection.class.isAssignableFrom(field.getType()))
                    {
                        subMethod = getSubMethod(field.getName(), clazz);
                        ParameterizedType pt = (ParameterizedType) field.getGenericType();
                        Class<?> subClass = (Class<?>) pt.getActualTypeArguments()[0];
                        this.subFields = FieldUtils.getFieldsListWithAnnotation(subClass, Excel.class);
                    }
                }

                if (field.isAnnotationPresent(Excels.class))
                {
                    Excels attrs = field.getAnnotation(Excels.class);
                    Excel[] excels = attrs.value();
                    for (Excel attr : excels)
                    {
                        if (!ArrayUtils.contains(this.excludeFields, field.getName() + "." + attr.targetAttr())
                                && (attr != null && (attr.type() == Type.ALL || attr.type() == type)))
                        {
                            field.setAccessible(true);
                            fields.add(new Object[] { field, attr });
                        }
                    }
                }
            }
        }
        return fields;
    }
    public short getRowHeight()
    {
        double maxHeight = 0;
        for (Object[] os : this.fields)
        {
            Excel excel = (Excel) os[1];
            maxHeight = Math.max(maxHeight, excel.height());
        }
        return (short) (maxHeight * 20);
    }

    public void createWorkbook()
    {
        this.wb = new SXSSFWorkbook(500);
        this.sheet = wb.createSheet();
        wb.setSheetName(0, sheetName);
        this.styles = createStyles(wb);
    }

    public void createSheet(int sheetNo, int index)
    {
        if (sheetNo > 1 && index > 0)
        {
            this.sheet = wb.createSheet();
            this.createTitle();
            wb.setSheetName(index, sheetName + index);
        }
    }

    public Object getCellValue(Row row, int column)
    {
        if (row == null)
        {
            return row;
        }
        Object val = "";
        try
        {
            Cell cell = row.getCell(column);
            if (StringUtils.isNotNull(cell))
            {
                if (cell.getCellType() == CellType.NUMERIC || cell.getCellType() == CellType.FORMULA)
                {
                    val = cell.getNumericCellValue();
                    if (DateUtil.isCellDateFormatted(cell))
                    {
                        val = DateUtil.getJavaDate((Double) val);
                    }
                    else
                    {
                        if ((Double) val % 1 != 0)
                        {
                            val = new BigDecimal(val.toString());
                        }
                        else
                        {
                            val = new DecimalFormat("0").format(val);
                        }
                    }
                }
                else if (cell.getCellType() == CellType.STRING)
                {
                    val = cell.getStringCellValue();
                }
                else if (cell.getCellType() == CellType.BOOLEAN)
                {
                    val = cell.getBooleanCellValue();
                }
                else if (cell.getCellType() == CellType.ERROR)
                {
                    val = cell.getErrorCellValue();
                }

            }
        }
        catch (Exception e)
        {
            return val;
        }
        return val;
    }

    private boolean isRowEmpty(Row row)
    {
        if (row == null)
        {
            return true;
        }
        for (int i = row.getFirstCellNum(); i < row.getLastCellNum(); i++)
        {
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK)
            {
                return false;
            }
        }
        return true;
    }

    public static Map<String, PictureData> getSheetPictures03(HSSFSheet sheet, HSSFWorkbook workbook)
    {
        Map<String, PictureData> sheetIndexPicMap = new HashMap<String, PictureData>();
        List<HSSFPictureData> pictures = workbook.getAllPictures();
        if (!pictures.isEmpty())
        {
            for (HSSFShape shape : sheet.getDrawingPatriarch().getChildren())
            {
                HSSFClientAnchor anchor = (HSSFClientAnchor) shape.getAnchor();
                if (shape instanceof HSSFPicture)
                {
                    HSSFPicture pic = (HSSFPicture) shape;
                    int pictureIndex = pic.getPictureIndex() - 1;
                    HSSFPictureData picData = pictures.get(pictureIndex);
                    String picIndex = anchor.getRow1() + "_" + anchor.getCol1();
                    sheetIndexPicMap.put(picIndex, picData);
                }
            }
            return sheetIndexPicMap;
        }
        else
        {
            return sheetIndexPicMap;
        }
    }

    public static Map<String, PictureData> getSheetPictures07(XSSFSheet sheet, XSSFWorkbook workbook)
    {
        Map<String, PictureData> sheetIndexPicMap = new HashMap<String, PictureData>();
        for (POIXMLDocumentPart dr : sheet.getRelations())
        {
            if (dr instanceof XSSFDrawing)
            {
                XSSFDrawing drawing = (XSSFDrawing) dr;
                List<XSSFShape> shapes = drawing.getShapes();
                for (XSSFShape shape : shapes)
                {
                    if (shape instanceof XSSFPicture)
                    {
                        XSSFPicture pic = (XSSFPicture) shape;
                        XSSFClientAnchor anchor = pic.getPreferredSize();
                        CTMarker ctMarker = anchor.getFrom();
                        String picIndex = ctMarker.getRow() + "_" + ctMarker.getCol();
                        sheetIndexPicMap.put(picIndex, pic.getPictureData());
                    }
                }
            }
        }
        return sheetIndexPicMap;
    }

    public String parseDateToStr(String dateFormat, Object val)
    {
        if (val == null)
        {
            return "";
        }
        String str;
        if (val instanceof Date)
        {
            str = DateUtils.parseDateToStr(dateFormat, (Date) val);
        }
        else if (val instanceof LocalDateTime)
        {
            str = DateUtils.parseDateToStr(dateFormat, DateUtils.toDate((LocalDateTime) val));
        }
        else if (val instanceof LocalDate)
        {
            str = DateUtils.parseDateToStr(dateFormat, DateUtils.toDate((LocalDate) val));
        }
        else
        {
            str = val.toString();
        }
        return str;
    }

    public boolean isSubList()
    {
        return StringUtils.isNotNull(subFields) && subFields.size() > 0;
    }

    public boolean isSubListValue(T vo)
    {
        return StringUtils.isNotNull(subFields) && subFields.size() > 0 && StringUtils.isNotNull(getListCellValue(vo)) && getListCellValue(vo).size() > 0;
    }

    public Collection<?> getListCellValue(Object obj)
    {
        Object value;
        try
        {
            value = subMethod.invoke(obj, new Object[] {});
        }
        catch (Exception e)
        {
            return new ArrayList<Object>();
        }
        return (Collection<?>) value;
    }

    public Method getSubMethod(String name, Class<?> pojoClass)
    {
        StringBuffer getMethodName = new StringBuffer("get");
        getMethodName.append(name.substring(0, 1).toUpperCase());
        getMethodName.append(name.substring(1));
        Method method = null;
        try
        {
            method = pojoClass.getMethod(getMethodName.toString(), new Class[] {});
        }
        catch (Exception e)
        {
            log.error("Error occurred while retrieving the object {}", e.getMessage());
        }
        return method;
    }
}
