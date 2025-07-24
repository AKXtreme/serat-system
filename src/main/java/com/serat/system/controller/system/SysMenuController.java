package com.serat.system.controller.system;

import com.serat.system.common.annotation.Log;
import com.serat.system.common.constant.UserConstants;
import com.serat.system.common.core.controller.BaseController;
import com.serat.system.common.core.domain.AjaxResult;
import com.serat.system.common.core.domain.entity.SysMenu;
import com.serat.system.common.enums.RequestType;
import com.serat.system.common.utils.StringUtils;
import com.serat.system.system.service.ISysMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system/menu")
public class SysMenuController extends BaseController
{
    @Autowired
    private ISysMenuService menuService;

    @PreAuthorize("@ss.hasPermi('system:menu:list')")
    @GetMapping("/list")
    public AjaxResult list(SysMenu menu)
    {
        List<SysMenu> menus = menuService.selectMenuList(menu, getUserId());
        return success(menus);
    }

    @PreAuthorize("@ss.hasPermi('system:menu:query')")
    @GetMapping(value = "/{menuId}")
    public AjaxResult getInfo(@PathVariable Long menuId)
    {
        return success(menuService.selectMenuById(menuId));
    }

    @GetMapping("/treeselect")
    public AjaxResult treeselect(SysMenu menu)
    {
        List<SysMenu> menus = menuService.selectMenuList(menu, getUserId());
        return success(menuService.buildMenuTreeSelect(menus));
    }

    @GetMapping(value = "/roleMenuTreeselect/{roleId}")
    public AjaxResult roleMenuTreeselect(@PathVariable("roleId") Long roleId)
    {
        List<SysMenu> menus = menuService.selectMenuList(getUserId());
        AjaxResult ajax = AjaxResult.success();
        ajax.put("checkedKeys", menuService.selectMenuListByRoleId(roleId));
        ajax.put("menus", menuService.buildMenuTreeSelect(menus));
        return ajax;
    }

    @PreAuthorize("@ss.hasPermi('system:menu:add')")
    @Log(title = "Menu Management", businessType = RequestType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody SysMenu menu) {
        if (!menuService.checkMenuNameUnique(menu)) {
            return error("Adding menu '" + menu.getMenuName() + "' failed. The menu name already exists.");
        } else if (UserConstants.YES_FRAME.equals(menu.getIsFrame()) && !StringUtils.ishttp(menu.getPath())) {
            return error("Adding menu '" + menu.getMenuName() + "' failed. The URL must start with http(s)://");
        }
        menu.setCreateBy(getUsername());
        return toAjax(menuService.insertMenu(menu));
    }

    @PreAuthorize("@ss.hasPermi('system:menu:edit')")
    @Log(title = "Menu Management", businessType = RequestType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody SysMenu menu) {
        if (!menuService.checkMenuNameUnique(menu)) {
            return error("Updating menu '" + menu.getMenuName() + "' failed. The menu name already exists.");
        } else if (UserConstants.YES_FRAME.equals(menu.getIsFrame()) && !StringUtils.ishttp(menu.getPath())) {
            return error("Updating menu '" + menu.getMenuName() + "' failed. The URL must start with http(s)://");
        } else if (menu.getMenuId().equals(menu.getParentId())) {
            return error("Updating menu '" + menu.getMenuName() + "' failed. The parent menu cannot be itself.");
        }
        menu.setUpdateBy(getUsername());
        return toAjax(menuService.updateMenu(menu));
    }

    @PreAuthorize("@ss.hasPermi('system:menu:remove')")
    @Log(title = "Menu Management", businessType = RequestType.DELETE)
    @DeleteMapping("/{menuId}")
    public AjaxResult remove(@PathVariable("menuId") Long menuId) {
        if (menuService.hasChildByMenuId(menuId)) {
            return warn("Sub-menus exist. Deletion is not allowed.");
        }
        if (menuService.checkMenuExistRole(menuId)) {
            return warn("The menu is assigned and cannot be deleted.");
        }
        return toAjax(menuService.deleteMenuById(menuId));
    }
}