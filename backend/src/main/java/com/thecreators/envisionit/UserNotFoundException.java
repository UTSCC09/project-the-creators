package com.thecreators.envisionit;

class UserNotFoundException extends RuntimeException {

    UserNotFoundException(String id) {
    super("Could not find employee " + id);
  }
}