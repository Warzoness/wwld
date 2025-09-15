package com.gateway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fullname", nullable = false, unique = true)
    private String fullname;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "hashpassword", nullable = false)
    private String hashpassword;

    @Column(name="email", nullable = false, unique = true)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "status")
    private String status;

    @Column(name= "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

    @Column(name = "enabled")
    private boolean enabled = true; // Mặc định là true, có thể thay đổi khi
}
