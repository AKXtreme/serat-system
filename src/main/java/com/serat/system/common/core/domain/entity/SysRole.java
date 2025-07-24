package com.serat.system.common.core.domain.entity;

import com.serat.system.common.core.domain.BaseEntity;
import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class SysRole extends BaseEntity{
    private static final long serialVersionUID = 1L;

    /** Role ID */
    @Excel(name = "Role Number", cellType = ColumnType.NUMERIC)
    private Long roleId;

    /** Role Name */
    @Excel(name = "Role Name")
    private String roleName;

    /** Role Permission */
    @Excel(name = "Role Permission")
    private String roleKey;

    /** Role Sort */
    @Excel(name = "Role Sort")
    private Integer roleSort;

    /** Data Scope (1: All data permissions; 2: Custom data permissions; 3: Department data permissions; 4: Department and below data permissions; 5: Personal data permissions only) */
    @Excel(name = "Data Scope", readConverterExp = "1=All data permissions,2=Custom data permissions,3=Department data permissions,4=Department and below data permissions,5=Personal data permissions only")
    private String dataScope;

    /** Menu tree selection item association display (0: Parent and child are not associated; 1: Parent and child are associated) */
    private boolean menuCheckStrictly;

    /** Department tree selection item association display (0: Parent and child are not associated; 1: Parent and child are associated) */
    private boolean deptCheckStrictly;

    /** Role Status (0: Normal; 1: Disabled) */
    @Excel(name = "Role Status", readConverterExp = "0=Normal,1=Disabled")
    private String status;
    private String delFlag;
    private boolean flag = false;
    private Long[] menuIds;
    private Long[] deptIds;
    private Set<String> permissions;
    public SysRole()
    {

    }
    public SysRole(Long roleId)
    {
        this.roleId = roleId;
    }

    public Long getRoleId()
    {
        return roleId;
    }

    public void setRoleId(Long roleId)
    {
        this.roleId = roleId;
    }

    public boolean isAdmin()
    {
        return isAdmin(this.roleId);
    }

    public static boolean isAdmin(Long roleId)
    {
        return roleId != null && 1L == roleId;
    }

    @NotBlank(message = "Role name cannot be empty")
    @Size(min = 0, max = 30, message = "The length of the role name cannot exceed 30 characters")
    public String getRoleName()
    {
        return roleName;
    }

    public void setRoleName(String roleName)
    {
        this.roleName = roleName;
    }

    @NotBlank(message = "Permission characters cannot be empty")
    @Size(min = 0, max = 100, message = "The length of the permission characters cannot exceed 100 characters")
    public String getRoleKey()
    {
        return roleKey;
    }

    public void setRoleKey(String roleKey)
    {
        this.roleKey = roleKey;
    }

    @NotNull(message = "Display order cannot be empty")
    public Integer getRoleSort()
    {
        return roleSort;
    }

    public void setRoleSort(Integer roleSort)
    {
        this.roleSort = roleSort;
    }

    public String getDataScope()
    {
        return dataScope;
    }

    public void setDataScope(String dataScope)
    {
        this.dataScope = dataScope;
    }

    public boolean isMenuCheckStrictly()
    {
        return menuCheckStrictly;
    }

    public void setMenuCheckStrictly(boolean menuCheckStrictly)
    {
        this.menuCheckStrictly = menuCheckStrictly;
    }

    public boolean isDeptCheckStrictly()
    {
        return deptCheckStrictly;
    }

    public void setDeptCheckStrictly(boolean deptCheckStrictly)
    {
        this.deptCheckStrictly = deptCheckStrictly;
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

    public boolean isFlag()
    {
        return flag;
    }

    public void setFlag(boolean flag)
    {
        this.flag = flag;
    }

    public Long[] getMenuIds()
    {
        return menuIds;
    }

    public void setMenuIds(Long[] menuIds)
    {
        this.menuIds = menuIds;
    }

    public Long[] getDeptIds()
    {
        return deptIds;
    }

    public void setDeptIds(Long[] deptIds)
    {
        this.deptIds = deptIds;
    }

    public Set<String> getPermissions()
    {
        return permissions;
    }

    public void setPermissions(Set<String> permissions)
    {
        this.permissions = permissions;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
                .append("roleId", getRoleId())
                .append("roleName", getRoleName())
                .append("roleKey", getRoleKey())
                .append("roleSort", getRoleSort())
                .append("dataScope", getDataScope())
                .append("menuCheckStrictly", isMenuCheckStrictly())
                .append("deptCheckStrictly", isDeptCheckStrictly())
                .append("status", getStatus())
                .append("delFlag", getDelFlag())
                .append("createBy", getCreateBy())
                .append("createTime", getCreateTime())
                .append("updateBy", getUpdateBy())
                .append("updateTime", getUpdateTime())
                .append("remark", getRemark())
                .toString();
    }
}
