package com.gateway.config;// CloudinaryConfig.java
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", System.getenv("dnfypskjn"),
                "api_key",    System.getenv("156696369873978"),
                "api_secret", System.getenv("UENZ-YQ0_Ap1U-aUbXXqT0gqMd4")));
    }
}
