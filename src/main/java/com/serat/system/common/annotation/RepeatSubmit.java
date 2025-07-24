package com.serat.system.common.annotation;

import java.lang.annotation.*;

@Inherited
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RepeatSubmit
{
    public int interval() default 5000;

    public String message() default "Duplicate submission is not allowed, please try again later";
}
