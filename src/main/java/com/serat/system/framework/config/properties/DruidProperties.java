package com.serat.system.framework.config.properties;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DruidProperties
{
    @Value("${spring.datasource.druid.initialSize}")
    private int initialSize;

    @Value("${spring.datasource.druid.minIdle}")
    private int minIdle;

    @Value("${spring.datasource.druid.maxActive}")
    private int maxActive;

    @Value("${spring.datasource.druid.maxWait}")
    private int maxWait;

    @Value("${spring.datasource.druid.connectTimeout}")
    private int connectTimeout;

    @Value("${spring.datasource.druid.socketTimeout}")
    private int socketTimeout;

    @Value("${spring.datasource.druid.timeBetweenEvictionRunsMillis}")
    private int timeBetweenEvictionRunsMillis;

    @Value("${spring.datasource.druid.minEvictableIdleTimeMillis}")
    private int minEvictableIdleTimeMillis;

    @Value("${spring.datasource.druid.maxEvictableIdleTimeMillis}")
    private int maxEvictableIdleTimeMillis;

    @Value("${spring.datasource.druid.validationQuery}")
    private String validationQuery;

    @Value("${spring.datasource.druid.testWhileIdle}")
    private boolean testWhileIdle;

    @Value("${spring.datasource.druid.testOnBorrow}")
    private boolean testOnBorrow;

    @Value("${spring.datasource.druid.testOnReturn}")
    private boolean testOnReturn;

    public DruidDataSource dataSource(DruidDataSource datasource)
    {
        /** Configure initialization size, minimum, maximum */
        datasource.setInitialSize(initialSize);
        datasource.setMaxActive(maxActive);
        datasource.setMinIdle(minIdle);

        /** Configure the timeout period for waiting to obtain a connection */
        datasource.setMaxWait(maxWait);

        /** Configure the driver connection timeout to detect the timeout for establishing a database connection in milliseconds */
        datasource.setConnectTimeout(connectTimeout);

        /** Configure the network timeout, the network timeout for waiting for database operations to complete, in milliseconds */
        datasource.setSocketTimeout(socketTimeout);

        /** Configure the interval for checking whether idle connections need to be closed, in milliseconds. */
        datasource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);

        /** Configure the minimum and maximum survival time of a connection in the pool in milliseconds */
        datasource.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
        datasource.setMaxEvictableIdleTimeMillis(maxEvictableIdleTimeMillis);

        /**
         * SQL used to detect whether the connection is valid. It is required to be a query statement. select 'x'。if validationQuery is null，testOnBorrow、testOnReturn、testWhileIdle Neither will work.
         */
        datasource.setValidationQuery(validationQuery);
        /** It is recommended to configure it to true, which does not affect performance and ensures security. When applying for a connection, if the idle time is greater than timeBetweenEvictionRunsMillis, execute validationQuery to check whether the connection is valid. */
        datasource.setTestWhileIdle(testWhileIdle);
        /** When applying for a connection, validationQuery is executed to check whether the connection is valid. This configuration will reduce performance. */
        datasource.setTestOnBorrow(testOnBorrow);
        /** When returning a connection, validationQuery is executed to check whether the connection is valid. This configuration will reduce performance. */
        datasource.setTestOnReturn(testOnReturn);
        return datasource;
    }
}
