package com.thecreators.envisionit;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thecreators.envisionit.Gallery;
import com.thecreators.envisionit.IGalleryRepository;

@RestController
public class GalleryController {

	//private final Logger LOG = LoggerFactory.getLogger(getClass());

	private final IGalleryRepository galleryRepository;

	public GalleryController(IGalleryRepository galleryRepository) {
		this.galleryRepository = galleryRepository;
	}

    @GetMapping("/api/gallery")
    public List<Gallery> getAllGalleries() {
        //LOG.info("Getting all gallery.");
        return galleryRepository.findAll();
    }

    @GetMapping("/api/gallery/{galleryId}")
    public Gallery getGallery(@PathVariable String galleryId) {
        //LOG.info("Getting gallery with ID: {}.", galleryId);
        return galleryRepository.findById(galleryId)
        .orElseThrow(() -> new UserNotFoundException(galleryId));
    }
    
    @PostMapping("/api/gallery")
    public Gallery addNewGallery(@RequestBody Gallery gallery) {
        //LOG.info("Saving gallery.");
        return galleryRepository.save(gallery);
    }


}
