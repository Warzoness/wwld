package com.gateway.response.UserResponse;

import com.gateway.dto.UserDTO;
import com.gateway.response.BaseResponse;
import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserResponse extends BaseResponse {
    List<UserDTO> listUsers;
    UserDTO userDTO;
}
