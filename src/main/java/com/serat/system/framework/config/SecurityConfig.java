package com.serat.system.framework.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.filter.CorsFilter;
import com.serat.system.framework.config.properties.PermitAllUrlProperties;
import com.serat.system.framework.security.filter.JwtAuthenticationTokenFilter;
import com.serat.system.framework.security.handle.AuthenticationEntryPointImpl;
import com.serat.system.framework.security.handle.LogoutSuccessHandlerImpl;

@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Configuration
public class SecurityConfig
{
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationEntryPointImpl unauthorizedHandler;

    @Autowired
    private LogoutSuccessHandlerImpl logoutSuccessHandler;

    @Autowired
    private JwtAuthenticationTokenFilter authenticationTokenFilter;

    @Autowired
    private CorsFilter corsFilter;

    @Autowired
    private PermitAllUrlProperties permitAllUrl;

    @Bean
    public AuthenticationManager authenticationManager()
    {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(bCryptPasswordEncoder());
        return new ProviderManager(daoAuthenticationProvider);
    }

    /**
     * anyRequest          |   Matches all request paths
     * access              |   Can be accessed when the SpringEl expression evaluates to true
     * anonymous           |   Can be accessed anonymously
     * denyAll             |   Access is denied for all users
     * fullyAuthenticated  |   Can be accessed by fully authenticated users (excluding automatic login under remember-me)
     * hasAnyAuthority     |   If parameters are provided, access is granted when the user has any one of the specified authorities
     * hasAnyRole          |   If parameters are provided, access is granted when the user has any one of the specified roles
     * hasAuthority        |   If a parameter is provided, access is granted when the user has the specified authority
     * hasIpAddress        |   If a parameter is provided, access is granted when the user's IP matches the parameter
     * hasRole             |   If a parameter is provided, access is granted when the user has the specified role
     * permitAll           |   Access is granted for all users
     * rememberMe          |   Allows access for users logged in via remember-me
     * authenticated       |   Can be accessed by logged-in users
     */
    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception
    {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .headers((headersCustomizer) -> {
                    headersCustomizer.cacheControl(cache -> cache.disable()).frameOptions(options -> options.sameOrigin());
                })
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((requests) -> {
                    permitAllUrl.getUrls().forEach(url -> requests.requestMatchers(url).permitAll());
                    requests.requestMatchers("/auth/**", "/system/**","/ticket/**","/monitor/**", "/register", "/captchaImage").permitAll()
                            .requestMatchers(HttpMethod.GET, "/", "/*.html", "/**/*.html", "/**/*.css", "/**/*.js", "/profile/**").permitAll()
                            .requestMatchers("/swagger-ui.html", "/swagger-resources/**", "/webjars/**", "/*/api-docs", "/druid/**").permitAll()
                            .anyRequest().authenticated();
                })
                .logout(logout -> logout.logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler))
                .addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(corsFilter, JwtAuthenticationTokenFilter.class)
                .addFilterBefore(corsFilter, LogoutFilter.class)
                .build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}
