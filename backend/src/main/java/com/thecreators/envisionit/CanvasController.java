package com.thecreators.envisionit;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thecreators.envisionit.Canvas;
import com.thecreators.envisionit.ICanvasRepository;

@RestController
public class CanvasController {

	//private final Logger LOG = LoggerFactory.getLogger(getClass());

	private final ICanvasRepository canvasRepository;

	public CanvasController(ICanvasRepository canvasRepository) {
		this.canvasRepository = canvasRepository;
	}

    @GetMapping("/api/canvas")
    public List<canvas> getAllCanvases() {
        //LOG.info("Getting all canvas.");
        return canvasRepository.findAll();
    }

    @GetMapping("/api/canvas/{canvasId}")
    public canvas getCanvas(@PathVariable String canvasId) {
        //LOG.info("Getting canvas with ID: {}.", canvasId);
        return canvasRepository.findById(canvasId)
        .orElseThrow(() -> new UserNotFoundException(canvasId));
    }
    
    @PostMapping("/api/canvas")
    public canvas addNewCanvas(@RequestBody Canvas canvas) {
        //LOG.info("Saving canvas.");
        return canvasRepository.save(canvas);
    }


}
