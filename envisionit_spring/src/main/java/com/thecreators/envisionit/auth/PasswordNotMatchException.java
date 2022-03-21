package com.thecreators.envisionit;

class PasswordNotMatchException extends RuntimeException {

    PasswordNotMatchException() {
    super("Password is incorrect.");
  }
}