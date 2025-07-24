package com.serat.system.framework.security.context;

import com.serat.system.common.core.text.Convert;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

public class PermissionContextHolder
{
    private static final String PERMISSION_CONTEXT_ATTRIBUTES = "PERMISSION_CONTEXT";

    public static void setContext(String permission)
    {
        RequestContextHolder.currentRequestAttributes().setAttribute(PERMISSION_CONTEXT_ATTRIBUTES, permission,
                RequestAttributes.SCOPE_REQUEST);
    }

    public static String getContext()
    {
        return Convert.toStr(RequestContextHolder.currentRequestAttributes().getAttribute(PERMISSION_CONTEXT_ATTRIBUTES,
                RequestAttributes.SCOPE_REQUEST));
    }
}
