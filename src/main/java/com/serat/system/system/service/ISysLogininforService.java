package com.serat.system.system.service;

import com.serat.system.system.domain.SysLogininfor;

import java.util.List;

public interface ISysLogininforService
{
    void insertLogininfor(SysLogininfor logininfor);

    List<SysLogininfor> selectLogininforList(SysLogininfor logininfor);

    int deleteLogininforByIds(Long[] infoIds);

    void cleanLogininfor();
}
