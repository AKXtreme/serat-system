package com.serat.system.controller.system;

import com.serat.system.common.annotation.Log;
import com.serat.system.common.config.SeratSystemConfig;
import com.serat.system.common.core.controller.BaseController;
import com.serat.system.common.core.domain.AjaxResult;
import com.serat.system.common.core.domain.entity.SysUser;
import com.serat.system.common.core.domain.dto.LoginUser;
import com.serat.system.common.enums.RequestType;
import com.serat.system.common.utils.SecurityUtils;
import com.serat.system.common.utils.StringUtils;
import com.serat.system.common.utils.file.FileUploadUtils;
import com.serat.system.common.utils.file.MimeTypeUtils;
import com.serat.system.framework.web.service.TokenService;
import com.serat.system.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/system/user/profile")
public class SysProfileController extends BaseController
{
    @Autowired
    private ISysUserService userService;

    @Autowired
    private TokenService tokenService;

    @GetMapping
    public AjaxResult profile()
    {
        LoginUser loginUser = getLoginUser();
        SysUser user = loginUser.getUser();
        AjaxResult ajax = AjaxResult.success(user);
        ajax.put("roleGroup", userService.selectUserRoleGroup(loginUser.getUsername()));
        ajax.put("postGroup", userService.selectUserPostGroup(loginUser.getUsername()));
        return ajax;
    }

    @Log(title = "Personal Information", businessType = RequestType.UPDATE)
    @PutMapping
    public AjaxResult updateProfile(@RequestBody SysUser user) {
        LoginUser loginUser = getLoginUser();
        SysUser currentUser = loginUser.getUser();
        currentUser.setNickName(user.getNickName());
        currentUser.setEmail(user.getEmail());
        currentUser.setPhonenumber(user.getPhonenumber());
        currentUser.setSex(user.getSex());
        if (StringUtils.isNotEmpty(user.getPhonenumber()) && !userService.checkPhoneUnique(currentUser)) {
            return error("Updating user '" + loginUser.getUsername() + "' failed. The phone number already exists.");
        }
        if (StringUtils.isNotEmpty(user.getEmail()) && !userService.checkEmailUnique(currentUser)) {
            return error("Updating user '" + loginUser.getUsername() + "' failed. The email address already exists.");
        }
        if (userService.updateUserProfile(currentUser) > 0) {
            // Update cached user information
            tokenService.setLoginUser(loginUser);
            return success();
        }
        return error("Exception occurred while updating personal information. Please contact the administrator.");
    }

    @Log(title = "Personal Information", businessType = RequestType.UPDATE)
    @PutMapping("/updatePwd")
    public AjaxResult updatePwd(String oldPassword, String newPassword) {
        LoginUser loginUser = getLoginUser();
        String userName = loginUser.getUsername();
        String password = loginUser.getPassword();
        if (!SecurityUtils.matchesPassword(oldPassword, password)) {
            return error("Password update failed. Incorrect old password.");
        }
        if (SecurityUtils.matchesPassword(newPassword, password)) {
            return error("The new password cannot be the same as the old password.");
        }
        newPassword = SecurityUtils.encryptPassword(newPassword);
        if (userService.resetUserPwd(userName, newPassword) > 0) {
            loginUser.getUser().setPassword(newPassword);
            tokenService.setLoginUser(loginUser);
            return success();
        }
        return error("Exception occurred while updating password. Please contact the administrator.");
    }

    @Log(title = "User Avatar", businessType = RequestType.UPDATE)
    @PostMapping("/avatar")
    public AjaxResult avatar(@RequestParam("avatarfile") MultipartFile file) throws Exception {
        if (!file.isEmpty()) {
            LoginUser loginUser = getLoginUser();
            String avatar = FileUploadUtils.upload(SeratSystemConfig.getAvatarPath(), file, MimeTypeUtils.IMAGE_EXTENSION);
            if (userService.updateUserAvatar(loginUser.getUsername(), avatar)) {
                AjaxResult ajax = AjaxResult.success();
                ajax.put("imgUrl", avatar);
                // Update cached user avatar
                loginUser.getUser().setAvatar(avatar);
                tokenService.setLoginUser(loginUser);
                return ajax;
            }
        }
        return error("Exception occurred while uploading the image. Please contact the administrator.");
    }
}
