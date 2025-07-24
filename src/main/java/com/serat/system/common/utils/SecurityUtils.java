package com.serat.system.common.utils;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.PatternMatchUtils;
import com.serat.system.common.constant.Constants;
import com.serat.system.common.constant.HttpStatus;
import com.serat.system.common.core.domain.entity.SysRole;
import com.serat.system.common.core.domain.dto.LoginUser;
import com.serat.system.common.exception.ServiceException;

public class SecurityUtils
{

    public static Long getUserId()
    {
        try
        {
            return getLoginUser().getUserId();
        }
        catch (Exception e)
        {
            throw new ServiceException("Failed to retrieve user ID", HttpStatus.UNAUTHORIZED);
        }
    }

    public static Long getDeptId()
    {
        try
        {
            return getLoginUser().getDeptId();
        }
        catch (Exception e)
        {
            throw new ServiceException("Failed to retrieve department ID", HttpStatus.UNAUTHORIZED);
        }
    }

    public static String getUsername()
    {
        try
        {
            return getLoginUser().getUsername();
        }
        catch (Exception e)
        {
            throw new ServiceException("Failed to retrieve user account", HttpStatus.UNAUTHORIZED);
        }
    }

    public static LoginUser getLoginUser()
    {
        try
        {
            return (LoginUser) getAuthentication().getPrincipal();
        }
        catch (Exception e)
        {
            throw new ServiceException("Failed to retrieve user information", HttpStatus.UNAUTHORIZED);
        }
    }

    public static Authentication getAuthentication()
    {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static String encryptPassword(String password)
    {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }

    public static boolean matchesPassword(String rawPassword, String encodedPassword)
    {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public static boolean isAdmin(Long userId)
    {
        return userId != null && 1L == userId;
    }

    public static boolean hasPermi(String permission)
    {
        return hasPermi(getLoginUser().getPermissions(), permission);
    }

    public static boolean hasPermi(Collection<String> authorities, String permission)
    {
        return authorities.stream().filter(StringUtils::hasText)
                .anyMatch(x -> Constants.ALL_PERMISSION.equals(x) || PatternMatchUtils.simpleMatch(x, permission));
    }

    public static boolean hasRole(String role)
    {
        List<SysRole> roleList = getLoginUser().getUser().getRoles();
        Collection<String> roles = roleList.stream().map(SysRole::getRoleKey).collect(Collectors.toSet());
        return hasRole(roles, role);
    }

    public static boolean hasRole(Collection<String> roles, String role)
    {
        return roles.stream().filter(StringUtils::hasText)
                .anyMatch(x -> Constants.SUPER_ADMIN.equals(x) || PatternMatchUtils.simpleMatch(x, role));
    }

}

