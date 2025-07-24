package com.serat.system.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "map")
public class SeratSystemConfig
{
    private String name;

    private String version;

    private String copyrightYear;

    private static String profile;

    private static boolean addressEnabled;

    private static String captchaType;

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getVersion()
    {
        return version;
    }

    public void setVersion(String version)
    {
        this.version = version;
    }

    public String getCopyrightYear()
    {
        return copyrightYear;
    }

    public void setCopyrightYear(String copyrightYear)
    {
        this.copyrightYear = copyrightYear;
    }

    public static String getProfile()
    {
        return profile;
    }

    public void setProfile(String profile)
    {
        SeratSystemConfig.profile = profile;
    }

    public static boolean isAddressEnabled()
    {
        return addressEnabled;
    }

    public void setAddressEnabled(boolean addressEnabled)
    {
        SeratSystemConfig.addressEnabled = addressEnabled;
    }

    public static String getCaptchaType() {
        return captchaType;
    }

    public void setCaptchaType(String captchaType) {
        SeratSystemConfig.captchaType = captchaType;
    }

    public static String getImportPath()
    {
        return getProfile() + "/import";
    }

    public static String getAvatarPath()
    {
        return getProfile() + "/avatar";
    }

    public static String getDownloadPath()
    {
        return getProfile() + "/download/";
    }

    public static String getUploadPath()
    {
        return getProfile() + "/upload";
    }
}
