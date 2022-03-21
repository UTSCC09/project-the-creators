package com.thecreators.envisionit;

class CanvasNotFoundException extends RuntimeException {

    CanvasNotFoundException(String id) {
    super("Could not find canvas with id " + id);
  }
}