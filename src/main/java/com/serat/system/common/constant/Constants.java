package com.serat.system.common.constant;

import io.jsonwebtoken.Claims;

import java.util.Locale;

public class Constants
{
    public static final String UTF8 = "UTF-8";

    public static final String GBK = "GBK";

    public static final Locale DEFAULT_LOCALE = Locale.SIMPLIFIED_CHINESE;
    public static final String WWW = "www.";
    public static final String HTTP = "http://";

    public static final String HTTPS = "https://";

    public static final String SUCCESS = "0";

    public static final String FAIL = "1";

    public static final String LOGIN_SUCCESS = "Success";

    public static final String LOGOUT = "Logout";

    public static final String REGISTER = "Register";

    public static final String LOGIN_FAIL = "Error";

    public static final String ALL_PERMISSION = "*:*:*";

    public static final String SUPER_ADMIN = "admin";

    public static final String ROLE_DELIMETER = ",";

    public static final String PERMISSION_DELIMETER = ",";

    public static final Integer CAPTCHA_EXPIRATION = 2;

    public static final String TOKEN = "token";

    public static final String TOKEN_PREFIX = "Bearer ";

    public static final String LOGIN_USER_KEY = "login_user_key";

    public static final String JWT_USERID = "userid";

    public static final String JWT_USERNAME = Claims.SUBJECT;

    public static final String JWT_AVATAR = "avatar";

    public static final String JWT_CREATED = "created";

    public static final String JWT_AUTHORITIES = "authorities";

    public static final String RESOURCE_PREFIX = "/profile";

    public static final String LOOKUP_RMI = "rmi:";

    public static final String LOOKUP_LDAP = "ldap:";

    public static final String LOOKUP_LDAPS = "ldaps:";

    public static final String[] JSON_WHITELIST_STR = { "org.springframework", "com.ruoyi" };

    public static final String[] JOB_WHITELIST_STR = { "com.ruoyi.quartz.task" };

    public static final String[] JOB_ERROR_STR = { "java.net.URL", "jakarta.naming.InitialContext",
            "org.springframework", "org.apache", "com.a.map.common.utils.file", "com.a.map.common.config", "com.a.map.generator" };
}
