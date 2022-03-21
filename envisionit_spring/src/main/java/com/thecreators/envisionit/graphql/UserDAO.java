package com.thecreators.envisionit;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thecreators.envisionit.User; 
import com.thecreators.envisionit.IUserRepository; 

public class UserDAO {
    //private List<Author> users;
    private final IUserRepository userRepository;


    public UserDAO(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        //LOG.info("Getting all users);
        return userRepository.findAll();
    }

    public User getUser(String userId) {
        //LOG.info("Getting user with ID: {}.", userId);
        return userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public User addUser(User user) {
        //LOG.info("Getting user with ID: {}.", userId);
        return userRepository.save(user);
    }

}