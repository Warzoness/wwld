package com.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    private String createdAt;
    private String updatedAt;
    private String hashpassword;
    private boolean enabled;

    public UserDTO(Long id, String username, String email, String role, String status, String createdAt, String updatedAt, String hashpassword) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.hashpassword = hashpassword;
        this.enabled = true;
    }
}
