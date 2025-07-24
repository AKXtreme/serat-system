package com.serat.system.common.enums;

import com.serat.system.common.utils.DesensitizedUtil;

import java.util.function.Function;

public enum DesensitizedType
{
    USERNAME(s -> s.replaceAll("(\\S)\\S(\\S*)", "$1*$2")),

    PASSWORD(DesensitizedUtil::password),

    ID_CARD(s -> s.replaceAll("(\\d{4})\\d{10}(\\d{3}[Xx]|\\d{4})", "$1** **** ****$2")),

    PHONE(s -> s.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2")),

    EMAIL(s -> s.replaceAll("(^.)[^@]*(@.*$)", "$1****$2")),

    BANK_CARD(s -> s.replaceAll("\\d{15}(\\d{3})", "**** **** **** **** $1")),

    CAR_LICENSE(DesensitizedUtil::carLicense);

    private final Function<String, String> desensitizer;

    DesensitizedType(Function<String, String> desensitizer)
    {
        this.desensitizer = desensitizer;
    }

    public Function<String, String> desensitizer()
    {
        return desensitizer;
    }
}
