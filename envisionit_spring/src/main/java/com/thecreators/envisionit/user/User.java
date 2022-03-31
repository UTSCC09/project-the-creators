package com.thecreators.envisionit;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class User {

	@Id
	private String userId;
	private String username;
	private String email;
	private String password;
	private Date creationDate = new Date();
	private Map<String, String> userSettings = new HashMap<>();

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Map<String, String> getUserSettings() {
		return userSettings;
	}

	public void setUserSettings(Map<String, String> userSettings) {
		this.userSettings = userSettings;
	}

	public String toString() {
		return this.getUserId();
	}
}