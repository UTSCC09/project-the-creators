package com.thecreators.envisionit;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EnvisionitController {

	@GetMapping("/")
	public String index() {
		return "Greetings from Spring Boot!";
	}


}