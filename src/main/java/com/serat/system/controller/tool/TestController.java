package com.serat.system.controller.tool;

import com.serat.system.common.core.controller.BaseController;
import com.serat.system.common.core.domain.Response;
import com.serat.system.common.utils.StringUtils;
import io.swagger.annotations.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Api("User Information Management")
@RestController
@RequestMapping("/test/user")
public class TestController extends BaseController
{
    private final static Map<Integer, UserEntity> users = new LinkedHashMap<Integer, UserEntity>();
    {
        users.put(1, new UserEntity(1, "admin", "admin123", "15888888888"));
        users.put(2, new UserEntity(2, "ry", "admin123", "15666666666"));
    }

    @ApiOperation("Retrieve User List")
    @GetMapping("/list")
    public Response<List<UserEntity>> userList()
    {
        List<UserEntity> userList = new ArrayList<UserEntity>(users.values());
        return Response.ok(userList);
    }

    @ApiOperation("Retrieve User Details")
    @ApiImplicitParam(name = "userId", value = "ID", required = true, dataType = "int", paramType = "path", dataTypeClass = Integer.class)
    @GetMapping("/{userId}")
    public Response<UserEntity> getUser(@PathVariable Integer userId)
    {
        if (!users.isEmpty() && users.containsKey(userId))
        {
            return Response.ok(users.get(userId));
        }
        else
        {
            return Response.fail("User does not exist");
        }
    }

    @ApiOperation("Add New User")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "User ID", dataType = "Integer", dataTypeClass = Integer.class),
            @ApiImplicitParam(name = "username", value = "Username", dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "password", value = "Password", dataType = "String", dataTypeClass = String.class),
            @ApiImplicitParam(name = "mobile", value = "Mobile", dataType = "String", dataTypeClass = String.class)
    })
    @PostMapping("/save")
    public Response<String> save(UserEntity user) {
        if (StringUtils.isNull(user) || StringUtils.isNull(user.getUserId())) {
            return Response.fail("User ID cannot be null");
        }
        users.put(user.getUserId(), user);
        return Response.ok();
    }

    @ApiOperation("Update User")
    @PutMapping("/update")
    public Response<String> update(@RequestBody UserEntity user)
    {
        if (StringUtils.isNull(user) || StringUtils.isNull(user.getUserId())) {
            return Response.fail("User ID cannot be null");
        }
        if (users.isEmpty() || !users.containsKey(user.getUserId())) {
            return Response.fail("User does not exist");
        }
        users.remove(user.getUserId());
        users.put(user.getUserId(), user);
        return Response.ok();
    }

    @ApiOperation("Delete User Information")
    @ApiImplicitParam(name = "userId", value = "ID", required = true, dataType = "int", paramType = "path", dataTypeClass = Integer.class)
    @DeleteMapping("/{userId}")
    public Response<String> delete(@PathVariable Integer userId)
    {
        if (!users.isEmpty() && users.containsKey(userId))
        {
            users.remove(userId);
            return Response.ok();
        }
        else
        {
            return Response.fail("User does not exist");
        }
    }
}

@ApiModel(value = "UserEntity", description = "User Entity")
class UserEntity
{
    @ApiModelProperty("User ID")
    private Integer userId;

    @ApiModelProperty("Username")
    private String username;

    @ApiModelProperty("Password")
    private String password;

    @ApiModelProperty("User Mobile")
    private String mobile;

    public UserEntity()
    {

    }

    public UserEntity(Integer userId, String username, String password, String mobile)
    {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.mobile = mobile;
    }

    public Integer getUserId()
    {
        return userId;
    }

    public void setUserId(Integer userId)
    {
        this.userId = userId;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getMobile()
    {
        return mobile;
    }

    public void setMobile(String mobile)
    {
        this.mobile = mobile;
    }
}
