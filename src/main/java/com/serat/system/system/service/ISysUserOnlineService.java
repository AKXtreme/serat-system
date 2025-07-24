package com.serat.system.system.service;

import com.serat.system.common.core.domain.dto.LoginUser;
import com.serat.system.system.domain.SysUserOnline;

public interface ISysUserOnlineService
{
    SysUserOnline selectOnlineByIpaddr(String ipaddr, LoginUser user);

    SysUserOnline selectOnlineByUserName(String userName, LoginUser user);

    SysUserOnline selectOnlineByInfo(String ipaddr, String userName, LoginUser user);

    SysUserOnline loginUserToUserOnline(LoginUser user);
}
