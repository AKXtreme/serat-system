package com.serat.system.system.service;

import com.serat.system.system.domain.SysOperLog;

import java.util.List;

public interface ISysOperLogService
{
    void insertOperlog(SysOperLog operLog);

    List<SysOperLog> selectOperLogList(SysOperLog operLog);

    int deleteOperLogByIds(Long[] operIds);

    SysOperLog selectOperLogById(Long operId);

    void cleanOperLog();
}
