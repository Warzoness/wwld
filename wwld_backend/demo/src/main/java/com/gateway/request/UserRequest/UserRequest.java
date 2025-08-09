package com.gateway.request.UserRequest;


import com.gateway.request.BaseRequest;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserRequest extends BaseRequest {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    private String createdAt;
    private String updatedAt;
    private String hashpassword;
    private boolean enabled = true; // Mặc định là true, có thể thay đổi khi cần thiết
}
