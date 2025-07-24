package com.serat.system.system.service;

import com.serat.system.system.domain.SysConfig;

import java.util.List;

public interface ISysConfigService
{
    SysConfig selectConfigById(Long configId);
    String selectConfigByKey(String configKey);
    boolean selectCaptchaEnabled();
    List<SysConfig> selectConfigList(SysConfig config);
    int insertConfig(SysConfig config);
    int updateConfig(SysConfig config);
    void deleteConfigByIds(Long[] configIds);
    void loadingConfigCache();
    void clearConfigCache();
    void resetConfigCache();
    boolean checkConfigKeyUnique(SysConfig config);
}
