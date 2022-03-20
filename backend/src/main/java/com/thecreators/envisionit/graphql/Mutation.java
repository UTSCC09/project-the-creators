package com.thecreators.envisionit;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import com.thecreators.envisionit.IUserRepository;
import com.thecreators.envisionit.UserDAO;

public class Mutation implements GraphQLMutationResolver {
    private UserDAO userDao;

    public Mutation(UserDAO userDao) {
        this.userDao = userDao;
    }

    public User addUser(String username) {
        User user = new User();
        user.setUsername(username);
        userDao.addUser(user);
        return user;
    }
}