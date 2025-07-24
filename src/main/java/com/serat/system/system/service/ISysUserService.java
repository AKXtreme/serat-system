package com.serat.system.system.service;

import com.serat.system.common.core.domain.entity.SysUser;

import java.util.List;

public interface ISysUserService
{
    List<SysUser> selectUserList(SysUser user);
    List<SysUser> selectAllocatedList(SysUser user);
    List<SysUser> selectUnallocatedList(SysUser user);
    SysUser selectUserByUserName(String userName);
    SysUser selectUserById(Long userId);
    String selectUserRoleGroup(String userName);
    String selectUserPostGroup(String userName);
    boolean checkUserNameUnique(SysUser user);
    boolean checkPhoneUnique(SysUser user);
    boolean checkEmailUnique(SysUser user);
    void checkUserAllowed(SysUser user);
    void checkUserDataScope(Long userId);
    int insertUser(SysUser user);
    boolean registerUser(SysUser user);
    int updateUser(SysUser user);
    void insertUserAuth(Long userId, Long[] roleIds);
    int updateUserStatus(SysUser user);
    int updateUserProfile(SysUser user);
    boolean updateUserAvatar(String userName, String avatar);
    int resetPwd(SysUser user);
    int resetUserPwd(String userName, String password);
    int deleteUserById(Long userId);
    int deleteUserByIds(Long[] userIds);
    String importUser(List<SysUser> userList, Boolean isUpdateSupport, String operName);
}
