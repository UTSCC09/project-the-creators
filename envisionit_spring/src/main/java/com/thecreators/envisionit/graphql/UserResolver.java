package com.thecreators.envisionit;

import java.util.List;

import com.coxautodev.graphql.tools.GraphQLResolver;
import com.thecreators.envisionit.UserDAO;

public class UserResolver implements GraphQLResolver<User> {
    private UserDAO userDao;

    public UserResolver(UserDAO userDao) {
        this.userDao = userDao;
    }

    public User getUsers(User user) {
        return userDao.getUser(user.getUserId());
    }
}