package com.serat.system.framework.web.service;

import com.serat.system.common.constant.UserConstants;
import com.serat.system.common.core.domain.entity.SysRole;
import com.serat.system.common.core.domain.entity.SysUser;
import com.serat.system.common.utils.StringUtils;
import com.serat.system.system.service.ISysMenuService;
import com.serat.system.system.service.ISysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class SysPermissionService
{
    @Autowired
    private ISysRoleService roleService;

    @Autowired
    private ISysMenuService menuService;

    public Set<String> getRolePermission(SysUser user)
    {
        Set<String> roles = new HashSet<String>();
        if (user.isAdmin())
        {
            roles.add("admin");
        }
        else
        {
            roles.addAll(roleService.selectRolePermissionByUserId(user.getUserId()));
        }
        return roles;
    }

    public Set<String> getMenuPermission(SysUser user)
    {
        Set<String> perms = new HashSet<String>();
        if (user.isAdmin())
        {
            perms.add("*:*:*");
        }
        else
        {
            List<SysRole> roles = user.getRoles();
            if (!CollectionUtils.isEmpty(roles))
            {
                for (SysRole role : roles)
                {
                    if (StringUtils.equals(role.getStatus(), UserConstants.ROLE_NORMAL))
                    {
                        Set<String> rolePerms = menuService.selectMenuPermsByRoleId(role.getRoleId());
                        role.setPermissions(rolePerms);
                        perms.addAll(rolePerms);
                    }
                }
            }
            else
            {
                perms.addAll(menuService.selectMenuPermsByUserId(user.getUserId()));
            }
        }
        return perms;
    }
}
