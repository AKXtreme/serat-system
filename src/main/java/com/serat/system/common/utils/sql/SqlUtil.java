package com.serat.system.common.utils.sql;

import com.serat.system.common.exception.UtilException;
import com.serat.system.common.utils.StringUtils;

public class SqlUtil
{
    public static String SQL_REGEX = "and |extractvalue|updatexml|sleep|exec |insert |select |delete |update |drop |count |chr |mid |master |truncate |char |declare |or |union |like |+|/*|user()";

    public static String SQL_PATTERN = "[a-zA-Z0-9_\\ \\,\\.]+";

    private static final int ORDER_BY_MAX_LENGTH = 500;

    public static String escapeOrderBySql(String value)
    {
        if (StringUtils.isNotEmpty(value) && !isValidOrderBySql(value))
        {
            throw new UtilException("The parameter does not meet the specifications and cannot be queried");
        }
        if (StringUtils.length(value) > ORDER_BY_MAX_LENGTH) {
            throw new UtilException("The parameter exceeds the maximum limit and cannot be queried");
        }
        return value;
    }

    public static boolean isValidOrderBySql(String value)
    {
        return value.matches(SQL_PATTERN);
    }

    public static void filterKeyword(String value)
    {
        if (StringUtils.isEmpty(value))
        {
            return;
        }
        String[] sqlKeywords = StringUtils.split(SQL_REGEX, "\\|");
        for (String sqlKeyword : sqlKeywords)
        {
            if (StringUtils.indexOfIgnoreCase(value, sqlKeyword) > -1)
            {
                throw new UtilException("The parameter poses an SQL injection risk");
            }
        }
    }
}
