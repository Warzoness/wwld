package com.gateway.dao;

import com.gateway.dto.AreaDTO;
import com.gateway.dto.UserDTO;
import com.gateway.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserDAO extends JpaRepository<User, Long> {

    // find list user
    @Query("SELECT new com.gateway.dto.UserDTO(" +
            "ur.id, ur.username, ur.email, ur.role, ur.status," +
            "ur.createdAt, ur.updatedAt, ur.hashpassword" +
            ") FROM User ur " +
            "WHERE ( ur.id = :user_id OR :user_id IS NULL ) " +
            "AND (ur.username LIKE concat('%',:username,'%') OR :username = '' OR :username IS NULL )" +
            " ")
    List<UserDTO> findUsers(
            @Param("user_id") Long areaId,
            @Param("username") String areaName
    );

    // find user by username
    @Query("SELECT new com.gateway.dto.UserDTO(" +
            "ur.id, ur.username, ur.email, ur.role, ur.status," +
            "ur.createdAt, ur.updatedAt, ur.hashpassword" +
            ") FROM User ur " +
            "WHERE ur.username = :username"
    )
    UserDTO findUserByUsername(@Param("username") String username);
}
