package com.serat.system.common.utils.bean;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;

import java.util.Set;

public class BeanValidators
{
    public static void validateWithException(Validator validator, Object object, Class<?>... groups)
            throws ConstraintViolationException
    {
        Set<ConstraintViolation<Object>> constraintViolations = validator.validate(object, groups);
        if (!constraintViolations.isEmpty())
        {
            throw new ConstraintViolationException(constraintViolations);
        }
    }
}
