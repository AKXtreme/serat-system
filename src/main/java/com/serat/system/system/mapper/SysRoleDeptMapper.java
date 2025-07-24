package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysRoleDept;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysRoleDeptMapper
{
    int deleteRoleDeptByRoleId(Long roleId);

    int deleteRoleDept(Long[] ids);

    int selectCountRoleDeptByDeptId(Long deptId);

    int batchRoleDept(List<SysRoleDept> roleDeptList);
}
