package com.serat.system.system.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.serat.system.common.annotation.Excel;
import com.serat.system.common.annotation.Excel.ColumnType;
import com.serat.system.common.core.domain.BaseEntity;

import java.util.Date;

public class SysLogininfor extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    @Excel(name = "Serial Number", cellType = ColumnType.NUMERIC)
    private Long infoId;

    @Excel(name = "User Account")
    private String userName;

    @Excel(name = "Login Status", readConverterExp = "0=Success,1=Failure")
    private String status;

    @Excel(name = "Login Address")
    private String ipaddr;

    @Excel(name = "Login Location")
    private String loginLocation;

    @Excel(name = "Browser")
    private String browser;

    @Excel(name = "Operating System")
    private String os;

    @Excel(name = "Message")
    private String msg;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Excel(name = "Access Time", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date loginTime;

    public Long getInfoId()
    {
        return infoId;
    }

    public void setInfoId(Long infoId)
    {
        this.infoId = infoId;
    }

    public String getUserName()
    {
        return userName;
    }

    public void setUserName(String userName)
    {
        this.userName = userName;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getIpaddr()
    {
        return ipaddr;
    }

    public void setIpaddr(String ipaddr)
    {
        this.ipaddr = ipaddr;
    }

    public String getLoginLocation()
    {
        return loginLocation;
    }

    public void setLoginLocation(String loginLocation)
    {
        this.loginLocation = loginLocation;
    }

    public String getBrowser()
    {
        return browser;
    }

    public void setBrowser(String browser)
    {
        this.browser = browser;
    }

    public String getOs()
    {
        return os;
    }

    public void setOs(String os)
    {
        this.os = os;
    }

    public String getMsg()
    {
        return msg;
    }

    public void setMsg(String msg)
    {
        this.msg = msg;
    }

    public Date getLoginTime()
    {
        return loginTime;
    }

    public void setLoginTime(Date loginTime)
    {
        this.loginTime = loginTime;
    }
}
