package com.thecreators.envisionit.canvas;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CanvasStroke {
    private int x0;
    private int y0  ;
    private int x1;
    private int y1;
    private String lineStyle;
    private String strokeColour;
    private int lineWidth;

}
