package com.serat.system.common.core.domain.entity;

import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import com.serat.system.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SysDictType extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** Dictionary Primary Key */
    @Excel(name = "Dictionary Primary Key", cellType = ColumnType.NUMERIC)
    private Long dictId;

    /** Dictionary Name */
    @Excel(name = "Dictionary Name")
    private String dictName;

    /** Dictionary Type */
    @Excel(name = "Dictionary Type")
    private String dictType;

    /** Status (0=Normal, 1=Disabled) */
    @Excel(name = "Status", readConverterExp = "0=Normal,1=Disabled")
    private String status;

    public Long getDictId()
    {
        return dictId;
    }

    public void setDictId(Long dictId)
    {
        this.dictId = dictId;
    }

    @NotBlank(message = "Dictionary Name cannot be empty")
    @Size(min = 0, max = 100, message = "Dictionary Name length cannot exceed 100 characters")
    public String getDictName()
    {
        return dictName;
    }

    public void setDictName(String dictName)
    {
        this.dictName = dictName;
    }

    @NotBlank(message = "Dictionary Type cannot be empty")
    @Size(min = 0, max = 100, message = "Dictionary Type length cannot exceed 100 characters")
    @Pattern(regexp = "^[a-z][a-z0-9_]*$", message = "Dictionary Type must start with a letter and can only contain lowercase letters, numbers, and underscores")
    public String getDictType()
    {
        return dictType;
    }

    public void setDictType(String dictType)
    {
        this.dictType = dictType;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
    
    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("dictId", getDictId())
            .append("dictName", getDictName())
            .append("dictType", getDictType())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
