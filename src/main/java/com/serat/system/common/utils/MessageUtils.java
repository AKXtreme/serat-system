package com.serat.system.common.utils;

import com.serat.system.common.utils.spring.SpringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.NoSuchMessageException;

public class MessageUtils
{
    public static String message(String code, Object... args)
    {
        MessageSource messageSource = SpringUtils.getBean(MessageSource.class);
        //return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
        try {
            return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
        } catch (NoSuchMessageException e) {
            // Fallback message if key is not found
            return "[Missing message: " + code + "]"; // or any default message like: "Message not found"
        }
    }
}
