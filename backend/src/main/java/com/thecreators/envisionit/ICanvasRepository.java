package com.thecreators.envisionit;

import com.thecreators.envisionit.Canvas; 
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICanvasRepository extends MongoRepository<Canvas, String>  {
}
