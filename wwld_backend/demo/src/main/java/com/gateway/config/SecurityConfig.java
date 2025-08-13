package com.gateway.config;// SecurityConfig.java
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
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults()) // <-- nối với bean CorsConfigurationSource

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index", "/public/**", "/css/**", "/js/**", "/images/**", "/assets/**", "/uploads/**").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/user/**").hasAnyAuthority("USER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults())
                .formLogin(withDefaults());

        return http.build();
    }

    @Bean
    org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var cfg = new org.springframework.web.cors.CorsConfiguration();
        // Nếu dùng cookie/session: KHÔNG dùng "*"
        cfg.setAllowedOrigins(java.util.List.of(
                "http://localhost:3000",
                "https://wwld-delta.vercel.app"
        ));
        // Nếu cần cho tất cả subdomain Vercel (preview build), dùng patterns:
        // cfg.setAllowedOriginPatterns(java.util.List.of("https://*.vercel.app", "http://localhost:3000"));

        cfg.setAllowedMethods(java.util.List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(java.util.List.of("*"));
        cfg.setAllowCredentials(true); // dùng cookie/auth giữa FE & BE
        // Nếu cần đọc header auth/token/filename từ FE:
        // cfg.setExposedHeaders(List.of("Authorization","Content-Disposition"));

        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
