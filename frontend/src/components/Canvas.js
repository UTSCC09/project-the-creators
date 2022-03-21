import React, { useEffect, useRef, useState } from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import '../styles/Canvas.css';

import ColorSelector from './ColorSelector';

// Credits to help create the collaborative white board
// Credits: https://www.youtube.com/watch?v=FLESHMJ-bI0
// Credits: https://github.com/costingh/collaborative-whiteboard

// Credits to help set up websockets using spring boot
// Credits: https://www.youtube.com/watch?v=o_IjEDAuo8Y

var stompClient = null;
var currentX;
var currentY;

function Canvas() {

  const canvasRef = useRef();
  const contextRef = useRef();

  // States
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColour, setStrokeColour] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [lineStyle, setLineStyle] = useState("round");

  const makeConnection = () => {
    let sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(sock);
    stompClient.connect({}, function(frame) {
      console.log('User Connected');
      stompClient.subscribe('/canvas', onStrokeReceived);
    });
  }

  const onStrokeReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);
    drawing(payloadData.x0, payloadData.y0, payloadData.x1, payloadData.y1,
      payloadData.lineStyle, payloadData.strokeColour, payloadData.lineWidth, false);
  }

  const sendStroke = (x0, y0, x1, y1, lStyle, sColour, lWidth) => {
    if(stompClient) {
      let canvasStroke = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        lineStyle: lStyle,
        strokeColour: sColour,
        lineWidth: lWidth
      };

      stompClient.send('/app/canvasstroke', {}, JSON.stringify(canvasStroke));
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`; // Set the width of the canvas
    canvas.style.height = `${window.innerHeight}px`; // Set the height of the canvas

    const canvasContext = canvas.getContext("2d");
    canvasContext.scale(2,2);
    contextRef.current = canvasContext;

    makeConnection();
  }, []);

  const beginDraw = (e) => {
    currentX = e.clientX;
    currentY = e.clientY;
    setIsDrawing(true);
  };

  const endDraw = (e) => {
    if(isDrawing) {
      drawing(currentX, currentY, e.clientX, e.clientY, lineStyle, strokeColour, lineWidth, true);
      setIsDrawing(false);
    }
  };

  const drawLine = (e) => {
    if(isDrawing){
      drawing(currentX, currentY, e.clientX, e.clientY, lineStyle, strokeColour, lineWidth, true);
      currentX = e.clientX;
      currentY = e.clientY;
    }
  };

  const drawing = (x0, y0, x1, y1, lStyle, sColour, lWidth, toSend) => {
    const canvasContext = canvasRef.current.getContext("2d");
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    canvasContext.lineCap = lStyle;
    canvasContext.strokeStyle = sColour;
    canvasContext.lineWidth = lWidth;
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath();

    if (toSend) {
      sendStroke(x0, y0, x1, y1, lStyle, sColour, lWidth);
    }
  }

  return (
    <div>
      <ColorSelector setStrokeColour={setStrokeColour}/>
      <canvas
      id='main-canvas'
      ref={canvasRef}
      onMouseDown={beginDraw}
      onMouseUp={endDraw}
      onMouseMove={drawLine}>
    </canvas>
    </div>
  );
}

export default Canvas;
