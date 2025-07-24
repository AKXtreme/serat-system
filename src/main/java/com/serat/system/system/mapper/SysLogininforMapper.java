package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysLogininfor;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysLogininforMapper
{
    void insertLogininfor(SysLogininfor logininfor);

    List<SysLogininfor> selectLogininforList(SysLogininfor logininfor);

    int deleteLogininforByIds(Long[] infoIds);

    int cleanLogininfor();
}
