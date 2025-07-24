package com.serat.system.system.mapper;

import com.serat.system.common.core.domain.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysUserMapper
{
    List<SysUser> selectUserList(SysUser sysUser);

    List<SysUser> selectAllocatedList(SysUser user);

    List<SysUser> selectUnallocatedList(SysUser user);

    SysUser selectUserByUserName(String userName);

    SysUser selectUserById(Long userId);

    int insertUser(SysUser user);

    int updateUser(SysUser user);
    int updateUserStatus(@Param("userName") String userName, @Param("status") String status);

    int updateUserAvatar(@Param("userName") String userName, @Param("avatar") String avatar);

    int resetUserPwd(@Param("userName") String userName, @Param("password") String password);

    int deleteUserById(Long userId);

    int deleteUserByIds(Long[] userIds);

    SysUser checkUserNameUnique(String userName);

    SysUser checkPhoneUnique(String phonenumber);

    SysUser checkEmailUnique(String email);
}
