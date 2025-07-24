package com.serat.system.common.core.domain;

import com.serat.system.common.constant.HttpStatus;

import java.io.Serializable;

public class Response<T> implements Serializable{
    private static final long serialVersionUID = 1L;

    public static final int SUCCESS = HttpStatus.SUCCESS;

    public static final int FAIL = HttpStatus.ERROR;

    private int code;

    private String msg;

    private T data;

    public static <T> Response<T> ok()
    {
        return restResult(null, SUCCESS, "Operation successful");
    }

    public static <T> Response<T> ok(T data)
    {
        return restResult(data, SUCCESS, "Operation successful");
    }

    public static <T> Response<T> ok(T data, String msg)
    {
        return restResult(data, SUCCESS, msg);
    }

    public static <T> Response<T> fail()
    {
        return restResult(null, FAIL, "Operation successful");
    }

    public static <T> Response<T> fail(String msg)
    {
        return restResult(null, FAIL, msg);
    }

    public static <T> Response<T> fail(T data)
    {
        return restResult(data, FAIL, "Operation successful");
    }

    public static <T> Response<T> fail(T data, String msg)
    {
        return restResult(data, FAIL, msg);
    }

    public static <T> Response<T> fail(int code, String msg)
    {
        return restResult(null, code, msg);
    }

    private static <T> Response<T> restResult(T data, int code, String msg)
    {
        Response<T> apiResult = new Response<>();
        apiResult.setCode(code);
        apiResult.setData(data);
        apiResult.setMsg(msg);
        return apiResult;
    }

    public int getCode()
    {
        return code;
    }

    public void setCode(int code)
    {
        this.code = code;
    }

    public String getMsg()
    {
        return msg;
    }

    public void setMsg(String msg)
    {
        this.msg = msg;
    }

    public T getData()
    {
        return data;
    }

    public void setData(T data)
    {
        this.data = data;
    }

    public static <T> Boolean isError(Response<T> ret)
    {
        return !isSuccess(ret);
    }

    public static <T> Boolean isSuccess(Response<T> ret)
    {
        return Response.SUCCESS == ret.getCode();
    }
}
