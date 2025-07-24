package com.serat.system.system.domain;

import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import com.serat.system.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SysPost extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    @Excel(name = "Post Serial Number", cellType = ColumnType.NUMERIC)
    private Long postId;

    @Excel(name = "Post Code")
    private String postCode;

    @Excel(name = "Post Name")
    private String postName;

    @Excel(name = "Post Sort")
    private Integer postSort;

    @Excel(name = "Status", readConverterExp = "0=Normal,1=Disabled")
    private String status;

    private boolean flag = false;

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    @NotBlank(message = "Post code cannot be empty")
    @Size(min = 0, max = 64, message = "Post code length cannot exceed 64 characters")
    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    @NotBlank(message = "Post name cannot be empty")
    @Size(min = 0, max = 50, message = "Post name length cannot exceed 50 characters")
    public String getPostName() {
        return postName;
    }

    public void setPostName(String postName) {
        this.postName = postName;
    }

    @NotNull(message = "Display order cannot be empty")
    public Integer getPostSort()
    {
        return postSort;
    }

    public void setPostSort(Integer postSort)
    {
        this.postSort = postSort;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public boolean isFlag()
    {
        return flag;
    }

    public void setFlag(boolean flag)
    {
        this.flag = flag;
    }
    
    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("postId", getPostId())
            .append("postCode", getPostCode())
            .append("postName", getPostName())
            .append("postSort", getPostSort())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
