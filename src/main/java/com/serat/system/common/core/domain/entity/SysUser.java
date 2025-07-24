package com.serat.system.common.core.domain.entity;

import com.serat.system.common.core.domain.BaseEntity;
import com.serat.system.common.xss.Xss;
import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import com.serat.system.common.annotation.Excel.Type;
import com.serat.system.common.annotation.Excels;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import jakarta.validation.constraints.*;
import java.util.Date;
import java.util.List;

public class SysUser extends BaseEntity{
    private static final long serialVersionUID = 1L;

    /** User ID */
    @Excel(name = "User ID", type = Type.EXPORT, cellType = ColumnType.NUMERIC, prompt = "User ID")
    private Long userId;

    /** Department ID */
    @Excel(name = "Department ID", type = Type.IMPORT)
    private Long deptId;

    /** Username */
    @Excel(name = "Username")
    private String userName;

    /** Nickname */
    @Excel(name = "NickName")
    private String nickName;

    /** User Email */
    @Excel(name = "Email")
    private String email;

    /** Phone Number */
    @Excel(name = "Phone Number", cellType = ColumnType.TEXT)
    private String phonenumber;

    /** User Gender */
    @Excel(name = "Sex", readConverterExp = "0=Male, 1=Female, 2=Unknown")
    private String sex;

    /** User Avatar */
    private String avatar;

    /** Password */
    private String password;

    /** Account Status (0=Enabled, 1=Disabled) */
    @Excel(name = "Account Status", readConverterExp = "0=enabled, 1=disabled")
    private String status;

    /** Deletion Flag (0=Exists, 2=Deleted) */
    private String delFlag;

    /** Last Login IP */
    @Excel(name = "Login IP", type = Type.EXPORT)
    private String loginIp;

    /** Last Login Time */
    @Excel(name = "Last Login Time", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss", type = Type.EXPORT)
    private Date loginDate;

    /** Department Object */
    @Excels({
            @Excel(name = "Department Name", targetAttr = "deptName", type = Type.EXPORT),
            @Excel(name = "Department Leader", targetAttr = "leader", type = Type.EXPORT)
    })
    private SysDept dept;
    private List<SysRole> roles;
    private Long[] roleIds;
    private Long[] postIds;
    private Long roleId;
    public SysUser()
    {

    }

    public SysUser(Long userId)
    {
        this.userId = userId;
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public boolean isAdmin()
    {
        return isAdmin(this.userId);
    }

    public static boolean isAdmin(Long userId)
    {
        return userId != null && 1L == userId;
    }

    public Long getDeptId()
    {
        return deptId;
    }

    public void setDeptId(Long deptId)
    {
        this.deptId = deptId;
    }

    @Xss(message = "User nickname cannot contain script characters")
    @Size(min = 0, max = 30, message = "The length of the user nickname cannot exceed 30 characters")
    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    @Xss(message = "User account cannot contain script characters")
    @NotBlank(message = "User account cannot be empty")
    @Size(min = 0, max = 30, message = "The length of the user account cannot exceed 30 characters")
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Email(message = "Invalid email format")
    @Size(min = 0, max = 50, message = "The length of the email cannot exceed 50 characters")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Size(min = 0, max = 11, message = "The length of the phone number cannot exceed 11 characters")
    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber)
    {
        this.phonenumber = phonenumber;
    }

    public String getSex()
    {
        return sex;
    }

    public void setSex(String sex)
    {
        this.sex = sex;
    }

    public String getAvatar()
    {
        return avatar;
    }

    public void setAvatar(String avatar)
    {
        this.avatar = avatar;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getDelFlag()
    {
        return delFlag;
    }

    public void setDelFlag(String delFlag)
    {
        this.delFlag = delFlag;
    }

    public String getLoginIp()
    {
        return loginIp;
    }

    public void setLoginIp(String loginIp)
    {
        this.loginIp = loginIp;
    }

    public Date getLoginDate()
    {
        return loginDate;
    }

    public void setLoginDate(Date loginDate)
    {
        this.loginDate = loginDate;
    }

    public SysDept getDept()
    {
        return dept;
    }

    public void setDept(SysDept dept)
    {
        this.dept = dept;
    }

    public List<SysRole> getRoles()
    {
        return roles;
    }

    public void setRoles(List<SysRole> roles)
    {
        this.roles = roles;
    }

    public Long[] getRoleIds()
    {
        return roleIds;
    }

    public void setRoleIds(Long[] roleIds)
    {
        this.roleIds = roleIds;
    }

    public Long[] getPostIds()
    {
        return postIds;
    }

    public void setPostIds(Long[] postIds)
    {
        this.postIds = postIds;
    }

    public Long getRoleId()
    {
        return roleId;
    }

    public void setRoleId(Long roleId)
    {
        this.roleId = roleId;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
                .append("userId", getUserId())
                .append("deptId", getDeptId())
                .append("userName", getUserName())
                .append("nickName", getNickName())
                .append("email", getEmail())
                .append("phonenumber", getPhonenumber())
                .append("sex", getSex())
                .append("avatar", getAvatar())
                .append("password", getPassword())
                .append("status", getStatus())
                .append("delFlag", getDelFlag())
                .append("loginIp", getLoginIp())
                .append("loginDate", getLoginDate())
                .append("createBy", getCreateBy())
                .append("createTime", getCreateTime())
                .append("updateBy", getUpdateBy())
                .append("updateTime", getUpdateTime())
                .append("remark", getRemark())
                .append("dept", getDept())
                .toString();
    }
}
