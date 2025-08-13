package com.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Yêu cầu quyền ADMIN cho tất cả URL bắt đầu bằng /admin/
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // Yêu cầu quyền USER cho tất cả URL bắt đầu bằng /user/
                        .requestMatchers("/user/**").hasRole("USER")
                        // Các request khác được phép truy cập không cần đăng nhập
                        .anyRequest().permitAll()
                )
                // Nếu dùng form login
                .formLogin(withDefaults())
                // Nếu vẫn muốn bật Basic Auth (cho test API nhanh)
                .httpBasic(withDefaults());

        return http.build();
    }

}
