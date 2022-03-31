package com.thecreators.envisionit.canvas;

import com.thecreators.envisionit.canvas    .CanvasStroke;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CanvasStrokeController {

    @MessageMapping("/canvasstroke")
    @SendTo("/canvas")
    private CanvasStroke receiveCanvasStroke(@Payload CanvasStroke canvasStroke) {
        return canvasStroke;
    }
}
