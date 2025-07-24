package com.serat.system.framework.datasource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DynamicDataSourceContextHolder
{
    public static final Logger log = LoggerFactory.getLogger(DynamicDataSourceContextHolder.class);

    private static final ThreadLocal<String> CONTEXT_HOLDER = new ThreadLocal<>();

    public static void setDataSourceType(String dsType)
    {
        log.info("Switched to {} data source", dsType);
        CONTEXT_HOLDER.set(dsType);
    }

    public static String getDataSourceType()
    {
        return CONTEXT_HOLDER.get();
    }

    public static void clearDataSourceType()
    {
        CONTEXT_HOLDER.remove();
    }
}
