package com.serat.system.common.annotation;

import com.serat.system.common.utils.poi.ExcelHandlerAdapter;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.math.BigDecimal;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Excel
{
    /**
     * Sort in Excel when exporting
     */
    public int sort() default Integer.MAX_VALUE;

    /**
     * Export names to Excel.
     */
    public String name() default "";

    /**
     * Date format, such as: yyyy-MM-dd
     */
    public String dateFormat() default "";

    /**
     * If it is a dictionary type, please set the type value of the dictionary (for example: sys_user_sex)
     */
    public String dictType() default "";

    /**
     * Read the content and convert it into an expression (for example: 0=male, 1=female, 2=unknown)
     */
    public String readConverterExp() default "";

    /**
     * Delimiter, read the contents of the string group
     */
    public String separator() default ",";

    /**
     * BigDecimal precision default: -1 (BigDecimal formatting is not enabled by default)
     */
    public int scale() default -1;

    /**
     * BigDecimal Rounding rules Default:BigDecimal.ROUND_HALF_EVEN
     */
    public int roundingMode() default BigDecimal.ROUND_HALF_EVEN;

    /**
     * Height of each column in Excel when exporting
     */
    public double height() default 14;

    /**
     * Width of each column in Excel when exporting
     */
    public double width() default 16;

    /**
     * Text suffix, such as % 90 becomes 90%
     */
    public String suffix() default "";

    /**
     * When the value is empty, the default value of the field
     */
    public String defaultValue() default "";

    /**
     * Prompt message
     */
    public String prompt() default "";

    /**
     * Settings can only select column contents that cannot be entered.
     */
    public String[] combo() default {};

    /**
     * Whether to read data from the dictionary to combo, the default is not to read, if you want to read, you need to set the dictType annotation.
     */
    public boolean comboReadDict() default false;

    /**
     * Do you need to merge cells vertically to meet the demand: containing list collection cells)
     */
    public boolean needMerge() default false;

    /**
     * Whether to export data to meet demand: Sometimes we need to export a template, which is required for the title but the content needs to be filled in manually by the user.
     */
    public boolean isExport() default true;

    /**
     * The attribute name in another class supports multi-level acquisition and is separated by decimal points.
     */
    public String targetAttr() default "";

    /**
     * Whether to automatically count data and append a line of total statistical data at the end
     */
    public boolean isStatistics() default false;

    /**
     * Export type (0 number 1 string 2 picture)
     */
    public ColumnType cellType() default ColumnType.STRING;

    /**
     * Export column header background color
     */
    public IndexedColors headerBackgroundColor() default IndexedColors.GREY_50_PERCENT;

    /**
     * Export column header font color
     */
    public IndexedColors headerColor() default IndexedColors.WHITE;

    /**
     * Export cell background color
     */
    public IndexedColors backgroundColor() default IndexedColors.WHITE;

    /**
     * Export cell font color
     */
    public IndexedColors color() default IndexedColors.BLACK;

    /**
     * Export field alignment
     */
    public HorizontalAlignment align() default HorizontalAlignment.CENTER;

    /**
     * Custom data processor
     */
    public Class<?> handler() default ExcelHandlerAdapter.class;

    /**
     * Custom data processor parameters
     */
    public String[] args() default {};

    /**
     * Field type (0: export and import; 1: export only; 2: import only)
     */
    Type type() default Type.ALL;

    public enum Type
    {
        ALL(0), EXPORT(1), IMPORT(2);
        private final int value;

        Type(int value)
        {
            this.value = value;
        }

        public int value()
        {
            return this.value;
        }
    }

    public enum ColumnType
    {
        NUMERIC(0), STRING(1), IMAGE(2), TEXT(3);
        private final int value;

        ColumnType(int value)
        {
            this.value = value;
        }

        public int value()
        {
            return this.value;
        }
    }
}