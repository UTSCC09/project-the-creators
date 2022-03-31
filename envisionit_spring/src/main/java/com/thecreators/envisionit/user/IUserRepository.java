package com.thecreators.envisionit;

import java.util.List;
import com.thecreators.envisionit.User; 
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends MongoRepository<User, String>  {
    List<User> findByUsername(String username);


}
