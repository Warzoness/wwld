package com.gateway.bussiness;

import com.gateway.dto.UserDTO;
import com.gateway.entity.User;
import com.gateway.request.UserRequest.UserRequest;

import java.util.List;

public interface UserBusiness {

    List<UserDTO> findUsers(UserRequest request);
    User createUser(UserRequest request) throws Exception;
    UserDTO updateUser(UserRequest request) throws Exception;
    void deleteUser(UserRequest request) throws Exception;
    UserDTO authenticate(String username, String password) throws Exception;

}
