package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysOperLog;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysOperLogMapper
{
    void insertOperlog(SysOperLog operLog);

    List<SysOperLog> selectOperLogList(SysOperLog operLog);

    int deleteOperLogByIds(Long[] operIds);

    SysOperLog selectOperLogById(Long operId);

    void cleanOperLog();
}
