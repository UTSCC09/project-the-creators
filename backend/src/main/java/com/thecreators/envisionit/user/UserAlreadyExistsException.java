package com.thecreators.envisionit;

class UserAlreadyExistsException extends RuntimeException {

  UserAlreadyExistsException(String id) {
    super("A user already exists with id: " + id);
  }
}