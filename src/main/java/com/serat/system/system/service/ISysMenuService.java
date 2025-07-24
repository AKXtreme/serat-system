package com.serat.system.system.service;

import com.serat.system.common.core.domain.TreeSelect;
import com.serat.system.common.core.domain.entity.SysMenu;
import com.serat.system.system.domain.vo.RouterVo;

import java.util.List;
import java.util.Set;

public interface ISysMenuService
{
    List<SysMenu> selectMenuList(Long userId);

    List<SysMenu> selectMenuList(SysMenu menu, Long userId);

    Set<String> selectMenuPermsByUserId(Long userId);

    Set<String> selectMenuPermsByRoleId(Long roleId);

    List<SysMenu> selectMenuTreeByUserId(Long userId);

    List<Long> selectMenuListByRoleId(Long roleId);

    List<RouterVo> buildMenus(List<SysMenu> menus);

    List<SysMenu> buildMenuTree(List<SysMenu> menus);

    List<TreeSelect> buildMenuTreeSelect(List<SysMenu> menus);

    SysMenu selectMenuById(Long menuId);

    boolean hasChildByMenuId(Long menuId);

    boolean checkMenuExistRole(Long menuId);

    int insertMenu(SysMenu menu);

    int updateMenu(SysMenu menu);

   int deleteMenuById(Long menuId);

    boolean checkMenuNameUnique(SysMenu menu);
}
