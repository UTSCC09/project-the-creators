package com.thecreators.envisionit;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thecreators.envisionit.User; 
import com.thecreators.envisionit.IUserRepository; 

@RestController
public class UserController {

	//private final Logger LOG = LoggerFactory.getLogger(getClass());

	private final IUserRepository userRepository;

	public UserController(IUserRepository userRepository) {
		this.userRepository = userRepository;
	}

    @GetMapping("/api/users")
    public List<User> getAllUsers() {
        //LOG.info("Getting all users.");
        return userRepository.findAll();
    }

    @GetMapping("/api/users/{userId}")
    public User getUser(@PathVariable String userId) {
        //LOG.info("Getting user with ID: {}.", userId);
        return userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
    }
    
    @PostMapping("/api/users")
    public User addNewUsers(@RequestBody User user) {
        //LOG.info("Saving user.");
        return userRepository.save(user);
    }


}
