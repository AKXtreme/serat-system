package com.serat.system.common.core.domain.entity;

import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import com.serat.system.common.constant.UserConstants;
import com.serat.system.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SysDictData extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** Dictionary Code */
    @Excel(name = "Dictionary Code", cellType = ColumnType.NUMERIC)
    private Long dictCode;

    /** Dictionary Sort */
    @Excel(name = "Dictionary Sort", cellType = ColumnType.NUMERIC)
    private Long dictSort;

    /** Dictionary Label */
    @Excel(name = "Dictionary Label")
    private String dictLabel;

    /** Dictionary Key Value */
    @Excel(name = "Dictionary Key Value")
    private String dictValue;

    /** Dictionary Type */
    @Excel(name = "Dictionary Type")
    private String dictType;

    /** Style Attribute (Other Style Extensions) */
    private String cssClass;

    /** Table Dictionary Style */
    private String listClass;

    /** Is Default (Y=Yes, N=No) */
    @Excel(name = "Is Default", readConverterExp = "Y=Yes,N=No")
    private String isDefault;

    /** Status (0=Normal, 1=Disabled) */
    @Excel(name = "Status", readConverterExp = "0=Normal,1=Disabled")
    private String status;

    public Long getDictCode()
    {
        return dictCode;
    }

    public void setDictCode(Long dictCode)
    {
        this.dictCode = dictCode;
    }

    public Long getDictSort()
    {
        return dictSort;
    }

    public void setDictSort(Long dictSort)
    {
        this.dictSort = dictSort;
    }

    @NotBlank(message = "Dictionary Label cannot be empty")
    @Size(min = 0, max = 100, message = "Dictionary Label length cannot exceed 100 characters")
    public String getDictLabel()
    {
        return dictLabel;
    }

    public void setDictLabel(String dictLabel)
    {
        this.dictLabel = dictLabel;
    }

    @NotBlank(message = "Dictionary Key Value cannot be empty")
    @Size(min = 0, max = 100, message = "Dictionary key value length cannot exceed 100 characters")
    public String getDictValue()
    {
        return dictValue;
    }

    public void setDictValue(String dictValue)
    {
        this.dictValue = dictValue;
    }

    @NotBlank(message = "Dictionary Type cannot be empty")
    @Size(min = 0, max = 100, message = "Dictionary Type length cannot exceed 100 characters")
    public String getDictType()
    {
        return dictType;
    }

    public void setDictType(String dictType)
    {
        this.dictType = dictType;
    }

    @Size(min = 0, max = 100, message = "Style Attribute length cannot exceed 100 characters")
    public String getCssClass()
    {
        return cssClass;
    }

    public void setCssClass(String cssClass)
    {
        this.cssClass = cssClass;
    }

    public String getListClass()
    {
        return listClass;
    }

    public void setListClass(String listClass)
    {
        this.listClass = listClass;
    }

    public boolean getDefault()
    {
        return UserConstants.YES.equals(this.isDefault);
    }

    public String getIsDefault()
    {
        return isDefault;
    }

    public void setIsDefault(String isDefault)
    {
        this.isDefault = isDefault;
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
            .append("dictCode", getDictCode())
            .append("dictSort", getDictSort())
            .append("dictLabel", getDictLabel())
            .append("dictValue", getDictValue())
            .append("dictType", getDictType())
            .append("cssClass", getCssClass())
            .append("listClass", getListClass())
            .append("isDefault", getIsDefault())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
