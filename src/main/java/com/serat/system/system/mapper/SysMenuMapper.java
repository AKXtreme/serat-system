package com.serat.system.system.mapper;

import com.serat.system.common.core.domain.entity.SysMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysMenuMapper
{
    List<SysMenu> selectMenuList(SysMenu menu);

    List<String> selectMenuPerms();

    List<SysMenu> selectMenuListByUserId(SysMenu menu);

    List<String> selectMenuPermsByRoleId(Long roleId);

    List<String> selectMenuPermsByUserId(Long userId);

    List<SysMenu> selectMenuTreeAll();

    List<SysMenu> selectMenuTreeByUserId(Long userId);

    List<Long> selectMenuListByRoleId(@Param("roleId") Long roleId, @Param("menuCheckStrictly") boolean menuCheckStrictly);

    SysMenu selectMenuById(Long menuId);

    int hasChildByMenuId(Long menuId);

    int insertMenu(SysMenu menu);

    int updateMenu(SysMenu menu);

    int deleteMenuById(Long menuId);

    SysMenu checkMenuNameUnique(@Param("menuName") String menuName, @Param("parentId") Long parentId);
}
