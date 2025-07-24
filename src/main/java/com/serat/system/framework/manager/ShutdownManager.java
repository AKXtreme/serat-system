package com.serat.system.framework.manager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;

@Component
public class ShutdownManager
{
    private static final Logger logger = LoggerFactory.getLogger("sys-user");

    @PreDestroy
    public void destroy()
    {
        shutdownAsyncManager();
    }

    private void shutdownAsyncManager()
    {
        try
        {
            logger.info("====Shutting down the background task thread pool====");
            AsyncManager.me().shutdown();
        }
        catch (Exception e)
        {
            logger.error(e.getMessage(), e);
        }
    }
}
