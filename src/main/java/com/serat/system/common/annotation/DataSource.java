package com.serat.system.common.annotation;

import com.serat.system.common.enums.DataSourceType;

import java.lang.annotation.*;

@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface DataSource
{
    public DataSourceType value() default DataSourceType.MASTER;
}
