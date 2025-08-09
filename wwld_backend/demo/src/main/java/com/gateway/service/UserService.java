package com.gateway.service;


import com.gateway.bussiness.UserBusiness;
import com.gateway.bussiness.businessImpl.UserBusinessImpl;
import com.gateway.dto.UserDTO;
import com.gateway.entity.User;
import com.gateway.request.UserRequest.UserRequest;
import com.gateway.response.ApiResult;
import com.gateway.response.UserResponse.UserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/authentication")

public class UserService extends BaseFuntion {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserBusinessImpl userBusiness;

    // Các phương thức xử lý yêu cầu liên quan đến người dùng sẽ được định nghĩa ở đây
    // Ví dụ: đăng ký, đăng nhập, lấy thông tin người dùng, v.v.

    // Bạn có thể sử dụng các phương thức từ UserDAO để tương tác với cơ sở dữ liệu
    // và trả về các phản hồi phù hợp cho các yêu cầu từ phía client.
    // Get list users
    @RequestMapping(value = "/getListUsers", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<UserResponse> searchUsers(@RequestBody UserRequest request) {
        UserResponse response = new UserResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                // Call the business logic to find users
                response.setListUsers(userBusiness.findUsers(request));
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while searching users", e);
        }
        return ResponseEntity.ok(response);
    }

    ;

    // Register user
    @RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest request) {
        UserResponse response = new UserResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                // Call the business logic to create a user
                userBusiness.createUser(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while registering user", e);
        }
        return ResponseEntity.ok(response);
    }

    // Update user
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest request) {
        UserResponse response = new UserResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                // Call the business logic to update a user
                userBusiness.updateUser(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while updating user", e);
        }

        return ResponseEntity.ok(response);
    }

    ;

    // Delete user
    @RequestMapping(value = "/delete", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<UserResponse> deleteUser(@RequestBody UserRequest request) {
        UserResponse response = new UserResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                // Call the business logic to delete a user
                userBusiness.deleteUser(request);
                response.setResult(ApiResult.Result.OK);
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while deleting user", e);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        UserResponse response = new UserResponse();
        response.setBaseResponse(getBase(request));
        try {
            if (response.getResult().isOk()) {
                // Gọi business để kiểm tra thông tin đăng nhập
                UserDTO user = userBusiness.authenticate(request.getUsername(), request.getHashpassword());
                if (user != null) {
                    response.setUserDTO(user);
                    response.setResult(ApiResult.Result.OK);
                } else {
                    response.setResult(ApiResult.Result.FAILD);
                    LOGGER.error("Error while logging in user");
                }
            } else {
                response.setResult(ApiResult.Result.FAILD);
            }
        } catch (Exception e) {
            response.setResult(ApiResult.Result.FAILD);
            LOGGER.error("Error while login", e);
        }
        return ResponseEntity.ok(response);
    }





}
