package com.serat.system.system.mapper;

import com.serat.system.system.domain.SysRoleMenu;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysRoleMenuMapper
{
    int checkMenuExistRole(Long menuId);

    int deleteRoleMenuByRoleId(Long roleId);

    int deleteRoleMenu(Long[] ids);

    int batchRoleMenu(List<SysRoleMenu> roleMenuList);
}
