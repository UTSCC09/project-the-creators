package com.thecreators.envisionit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(GraphqlConfiguration.class)
public class EnvisionitApplication {

	public static void main(String[] args) {
		SpringApplication.run(EnvisionitApplication.class, args);
	}

}
