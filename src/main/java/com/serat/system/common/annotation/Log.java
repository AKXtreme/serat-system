package com.serat.system.common.annotation;

import com.serat.system.common.enums.OperatorType;
import com.serat.system.common.enums.RequestType;

import java.lang.annotation.*;

@Target({ ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log
{
    String title() default "";

    RequestType businessType() default RequestType.OTHER;

    OperatorType operatorType() default OperatorType.MANAGE;

    boolean isSaveRequestData() default true;

    boolean isSaveResponseData() default true;

    String[] excludeParamNames() default {};
}
