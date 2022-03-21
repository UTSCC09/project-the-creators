package com.thecreators.envisionit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@Import({GraphqlConfiguration.class, AuthConfig.class})
public class EnvisionitApplication {

	public static void main(String[] args) {
		SpringApplication.run(EnvisionitApplication.class, args);
	}
}
