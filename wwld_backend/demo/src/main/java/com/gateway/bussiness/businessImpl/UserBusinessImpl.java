package com.gateway.bussiness.businessImpl;

import com.gateway.bussiness.UserBusiness;
import com.gateway.dao.UserDAO;
import com.gateway.dto.UserDTO;
import com.gateway.entity.User;
import com.gateway.request.UserRequest.UserRequest;
import com.gateway.utils.PasswordHasher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.gateway.utils.PasswordHasher.hashPassword;
import static com.gateway.utils.PasswordHasher.passwordEncoder;


@Service(value = "userBusinessImpl")
public class UserBusinessImpl implements UserBusiness {

    @Autowired
    private UserDAO userDAO;

    @Override
    public List<UserDTO> findUsers(UserRequest request) {
        return userDAO.findUsers(request.getId(), request.getUsername());
    }

    @Override
    public User createUser(UserRequest request) throws Exception {
        User user = new User();
        user.setHashpassword(hashPassword(request.getHashpassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        user.setEnabled(request.isEnabled());
        user.setUpdatedAt("");
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        user.setCreatedAt(now);

        userDAO.save(user);
        if (user.getId() == null) {
            return user;
        } else {
            throw new Exception();
        }
    }

    @Override
    public UserDTO updateUser(UserRequest request) throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO = userDAO.findUserByUsername(request.getUsername());
        if (userDTO != null) {
            User user = new User();
            user.setId(userDTO.getId());
            user.setHashpassword(hashPassword(request.getHashpassword()));
            user.setEmail(request.getEmail());
            user.setRole(request.getRole());
            user.setStatus(request.getStatus());
            user.setEnabled(request.isEnabled());
            user.setCreatedAt(request.getCreatedAt());
            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            user.setUpdatedAt(now);

            userDAO.save(user);
        }
        return userDTO;
    }


    @Override
    public void deleteUser(UserRequest request) throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO = userDAO.findUserByUsername(request.getUsername());
        if (userDTO != null) {
            User user = new User();
            user.setId(userDTO.getId());
            user.setHashpassword(hashPassword(request.getHashpassword()));
            user.setEmail(request.getEmail());
            user.setRole(request.getRole());
            user.setStatus(request.getStatus());
            user.setEnabled(request.isEnabled());
            user.setCreatedAt(request.getCreatedAt());
            user.setUpdatedAt(request.getUpdatedAt());

            userDAO.delete(user);
        } else {
            throw new Exception("User not found with username: " + request.getUsername());
        }
    }

    @Override
    public UserDTO authenticate(String username, String password) {
        // Lấy user theo username
        UserDTO user = userDAO.findUserByUsername(username); // userDAO bạn đã có hoặc cần viết thêm
        if (user != null && passwordEncoder.matches(password, user.getHashpassword())) {
            return user; // đúng mật khẩu
        }
        return null; // sai mật khẩu
    }


}
