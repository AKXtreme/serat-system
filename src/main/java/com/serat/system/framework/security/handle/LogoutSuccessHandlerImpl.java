package com.serat.system.framework.security.handle;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import com.alibaba.fastjson2.JSON;
import com.serat.system.common.constant.Constants;
import com.serat.system.common.core.domain.AjaxResult;
import com.serat.system.common.core.domain.dto.LoginUser;
import com.serat.system.common.utils.MessageUtils;
import com.serat.system.common.utils.ServletUtils;
import com.serat.system.common.utils.StringUtils;
import com.serat.system.framework.manager.AsyncManager;
import com.serat.system.framework.manager.factory.AsyncFactory;
import com.serat.system.framework.web.service.TokenService;

@Configuration
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler
{
    @Autowired
    private TokenService tokenService;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException
    {
        LoginUser loginUser = tokenService.getLoginUser((HttpServletRequest) request);
        if (StringUtils.isNotNull(loginUser))
        {
            String userName = loginUser.getUsername();
            tokenService.delLoginUser(loginUser.getToken());
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(userName, Constants.LOGOUT, MessageUtils.message("user.logout.success")));
        }
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.success(MessageUtils.message("user.logout.success"))));
    }
}
