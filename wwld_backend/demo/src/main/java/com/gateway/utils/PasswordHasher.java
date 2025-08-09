package com.gateway.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHasher {

    // Tạo 1 instance encoder duy nhất, dùng static final
    public static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Hash mật khẩu
    public static String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    // Kiểm tra mật khẩu
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    // Test thử
    public static void main(String[] args) {
        String rawPassword = "mypassword123";
        String hashed = hashPassword(rawPassword);

        System.out.println("Hashed password: " + hashed);
        System.out.println("Password matches: " + checkPassword(rawPassword, hashed));
        System.out.println("Password matches wrong: " + checkPassword("wrongpassword", hashed));
    }
}
