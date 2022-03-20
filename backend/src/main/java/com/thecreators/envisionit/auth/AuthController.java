package com.thecreators.envisionit;

import com.thecreators.envisionit.UserAlreadyExistsException; 
import com.thecreators.envisionit.UserNotFoundException; 
import com.thecreators.envisionit.PasswordNotMatchException; 

import java.util.Optional;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;

import org.bson.Document;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndReplaceOptions;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;

import com.thecreators.envisionit.User; 
import com.thecreators.envisionit.UserController; 
import com.thecreators.envisionit.IUserRepository; 
import com.thecreators.envisionit.AuthConfig; 

@RestController
public class AuthController {

    private final IUserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

	public AuthController(IUserRepository userRepository) {
		this.userRepository = userRepository;
	}

    //@Bean
    //public PasswordEncoder encoder() {
    //    return new BCryptPasswordEncoder();
    //}

    //private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/auth/signup")
	public User signup(@RequestBody User user) {
        // Check if user already exists
        List<User> userDocs = userRepository.findByUsername(user.getUsername());
        if (userDocs.isEmpty()) {
            // Save new user
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            return userRepository.save(user);
        } else {
            // Already taken
            throw new UserAlreadyExistsException(user.getUsername());
        }
	}

    @PostMapping("/auth/signin")
	public User signin(@RequestBody User user) {
        // Check if user already exists
        List<User> userDocs = userRepository.findByUsername(user.getUsername());
        if (!userDocs.isEmpty()) {
            User userDoc = userDocs.get(0);
            // Check if password is correct
            if (passwordEncoder.matches(user.getPassword(), userDoc.getPassword())) {
                // Save user session
                System.out.println("is match " + passwordEncoder.matches(user.getPassword(), userDoc.getPassword()));
                return user;
            } else {
                throw new PasswordNotMatchException();
            }
        } else {
            // Not found
            throw new UserNotFoundException(user.getUsername());
        }
	}
    
}
