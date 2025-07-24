package com.serat.system.common.utils.poi;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Workbook;

public interface ExcelHandlerAdapter
{
    Object format(Object value, String[] args, Cell cell, Workbook wb);
}
