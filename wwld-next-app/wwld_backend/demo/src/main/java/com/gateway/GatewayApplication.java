package com.gateway;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.core.SpringVersion;


@SpringBootApplication
public class GatewayApplication extends SpringBootServletInitializer implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("Spring Framework version: " + SpringVersion.getVersion());
        System.out.println("GatewayApplication is running...");
    }
}