package com.thecreators.envisionit;

import com.thecreators.envisionit.User; 
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends MongoRepository<User, String>  {
    //@Query("{name:'?0'}")
    //GroceryItem findItemByName(String name);
    
    //@Query(value="{category:'?0'}", fields="{'name' : 1, 'quantity' : 1}")
    //List<GroceryItem> findAll(String category);
    
    //public long count();


}
