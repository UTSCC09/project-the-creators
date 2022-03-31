package com.thecreators.envisionit;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.thecreators.envisionit.User; 
import com.thecreators.envisionit.IUserRepository; 

@Service
public class AuthConfig {

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}
