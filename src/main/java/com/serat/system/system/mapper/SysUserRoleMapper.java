package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysUserRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysUserRoleMapper
{
    int deleteUserRoleByUserId(Long userId);

    int deleteUserRole(Long[] ids);

    int countUserRoleByRoleId(Long roleId);

    int batchUserRole(List<SysUserRole> userRoleList);

    int deleteUserRoleInfo(SysUserRole userRole);

    int deleteUserRoleInfos(@Param("roleId") Long roleId, @Param("userIds") Long[] userIds);
}
