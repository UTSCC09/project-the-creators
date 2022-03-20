package com.thecreators.envisionit;

import java.util.List;
import com.thecreators.envisionit.IUserRepository;
import com.thecreators.envisionit.UserDAO;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

@Component
public class Query implements GraphQLQueryResolver {
    private UserDAO userDao;

    public Query(UserDAO userDao) {
        this.userDao = userDao;
    }

    public String test() {
        return "hello!";
    }

    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }
}