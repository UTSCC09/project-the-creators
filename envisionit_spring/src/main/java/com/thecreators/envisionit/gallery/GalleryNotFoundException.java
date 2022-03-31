package com.thecreators.envisionit;

class GalleryNotFoundException extends RuntimeException {

  GalleryNotFoundException(String id) {
    super("Could not find gallery with id " + id);
  }
}