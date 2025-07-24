package com.serat.system.system.domain;

import com.serat.system.common.core.domain.BaseEntity;
import com.serat.system.common.xss.Xss;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SysNotice extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** Notice ID */
    private Long noticeId;

    /** Notice Title */
    private String noticeTitle;

    /** Notice Type (1=Notification, 2=Announcement) */
    private String noticeType;

    /** Notice Content */
    private String noticeContent;

    /** Notice Status (0=Active, 1=Closed) */
    private String status;

    public Long getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(Long noticeId) {
        this.noticeId = noticeId;
    }

    public void setNoticeTitle(String noticeTitle) {
        this.noticeTitle = noticeTitle;
    }

    @Xss(message = "Notice title cannot contain script characters")
    @NotBlank(message = "Notice title cannot be empty")
    @Size(min = 0, max = 50, message = "Notice title cannot exceed 50 characters")
    public String getNoticeTitle() {
        return noticeTitle;
    }

    public void setNoticeType(String noticeType)
    {
        this.noticeType = noticeType;
    }

    public String getNoticeType()
    {
        return noticeType;
    }

    public void setNoticeContent(String noticeContent)
    {
        this.noticeContent = noticeContent;
    }

    public String getNoticeContent()
    {
        return noticeContent;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getStatus()
    {
        return status;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("noticeId", getNoticeId())
            .append("noticeTitle", getNoticeTitle())
            .append("noticeType", getNoticeType())
            .append("noticeContent", getNoticeContent())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
