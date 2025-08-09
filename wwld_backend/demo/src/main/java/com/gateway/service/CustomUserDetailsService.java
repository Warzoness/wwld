package com.gateway.service;

import com.gateway.dao.UserDAO;
import com.gateway.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDAO userDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDTO userDTO = userDAO.findUserByUsername(username);
        if(userDTO == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userDTO.getRole());
        return new org.springframework.security.core.userdetails.User(
                userDTO.getUsername(),
                userDTO.getHashpassword(),
                Collections.singleton(authority)
        );
    }
}

