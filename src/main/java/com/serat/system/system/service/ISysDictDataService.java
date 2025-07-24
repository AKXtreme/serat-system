package com.serat.system.system.service;

import com.serat.system.common.core.domain.entity.SysDictData;

import java.util.List;

public interface ISysDictDataService
{
    List<SysDictData> selectDictDataList(SysDictData dictData);
    String selectDictLabel(String dictType, String dictValue);
    SysDictData selectDictDataById(Long dictCode);
    void deleteDictDataByIds(Long[] dictCodes);
    int insertDictData(SysDictData dictData);
    int updateDictData(SysDictData dictData);
}
