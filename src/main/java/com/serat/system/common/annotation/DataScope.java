package com.serat.system.common.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataScope
{
    public String deptAlias() default "";

    public String userAlias() default "";

    public String permission() default "";
}
