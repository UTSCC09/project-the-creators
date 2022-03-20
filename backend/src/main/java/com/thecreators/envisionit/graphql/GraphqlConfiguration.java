package com.thecreators.envisionit;

import java.util.ArrayList;
import java.util.List;

import com.thecreators.envisionit.UserController;
import com.thecreators.envisionit.UserDAO;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphqlConfiguration {
    @Bean
    public UserDAO userDao(IUserRepository userRepository) {
        return new UserDAO(userRepository);
    }

    //@Bean
    //public AuthorDao authorDao() {
    //    List<Author> authors = new ArrayList<>();
    //    for (int authorId = 0; authorId < 10; ++authorId) {
    //        Author author = new Author();
    //        author.setId("Author" + authorId);
    //        author.setName("Author " + authorId);
    //        author.setThumbnail("http://example.com/authors/" + authorId);
    //        authors.add(author);
    //    }
    //    return new AuthorDao(authors);
    //}

    //@Bean
    //public PostResolver postResolver(AuthorDao authorDao) {
    //    return new PostResolver(authorDao);
    //}

    @Bean
    public UserResolver userResolver(UserDAO userDao) {
        return new UserResolver(userDao);
    }

    @Bean
    public Query query(UserDAO userDao) {
        System.out.println(userDao.toString());
        return new Query(userDao);
    }

    @Bean
    public Mutation mutation(UserDAO userDao) {
        return new Mutation(userDao);
    }
}