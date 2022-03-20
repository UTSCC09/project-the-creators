package com.thecreators.envisionit;

import com.thecreators.envisionit.Gallery; 
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGalleryRepository extends MongoRepository<Gallery, String>  {
}
