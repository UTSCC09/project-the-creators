import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Canvas.css"
import ColorPicker from "./ColorPicker";
import StrokeSizeSelector from "./StrokeSizeSelector";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";

// Credits to help create the collaborative white board
// Credits: https://www.youtube.com/watch?v=FLESHMJ-bI0
// Credits: https://github.com/costingh/collaborative-whiteboard
// Credits: https://github.com/socketio/socket.io/tree/master/examples/whiteboard
// Credits: https://codepen.io/damyco/pen/vaJwbX

// Credits to help set up websockets using spring boot
// Credits: https://www.youtube.com/watch?v=o_IjEDAuo8Y

var currentX;
var currentY;
var socket = null;

// Brush ENUM
var DEFAULT = 1;
var PENCIL = 2;
var GRADIENT = 3;
var ERASER = 4;

function Canvas() {

  const location = useLocation();
  // window.history.replaceState({}, document.title);

  const canvasRef = useRef();
  const contextRef = useRef();

  // States
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColour, setStrokeColour] = useState("black");
  const [lineWidth, setLineWidth] = useState(10);
  const [lineStyle, setLineStyle] = useState("round");
  const [lineOpacity, setLineOpacity] = useState(1);
  const [isGradientBrush, setIsGradientBrush] = useState(false);
  const [isDefaultBrush, setIsDefaultBrush] = useState(true);
  const [isEraser, setIsEraser] = useState(false);
  const [isPencil, setIsPencil] = useState(false);
  const [hue, setHue] = useState(0);
  const [isLocal, setIsLocal] = useState(false);
  

  const makeConnection = () => {
    if(!isLocal){
      socket = io("http://localhost:3001");

      socket.on("receiveStroke", (data) => {
        onStrokeReceived(data);
    });
    }
  };


  const prepareCanvas = async () => {
    var data = await axios.post('http://localhost:3001/graphql', {
      query: `{
        getCanvas(
          creator: "${location.state.creator}", 
          title: "${location.state.title}") {
          _id
          thumbnailPath
          isShared
        }
      }`
    });

    setIsLocal(data.data.data.getCanvas.isShared);

    var canvasId = data.data.data.getCanvas._id;
    var canvasImage = data.data.data.getCanvas.thumbnailPath;

    // socket.emit('join-room', canvasId);

    const canvas = canvasRef.current;
    canvas.width = 1920;
    canvas.height = 1080;
    const canvasContext = canvas.getContext("2d");
    contextRef.current = canvasContext;


    if (canvasImage != null || canvasImage != "") {
      var img = new Image();
      img.onload = function () {
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = canvasImage;
    }

  };

  useEffect(() => {


    prepareCanvas();

    changeStrokeType(DEFAULT);

    makeConnection();
  }, []);

  const onStrokeReceived = (payloadData) => {
    drawing(
      payloadData.x0,
      payloadData.y0,
      payloadData.x1,
      payloadData.y1,
      payloadData.lineStyle,
      payloadData.lineOpacity,
      payloadData.strokeColour,
      payloadData.lineWidth,
      false
    );
  };

  const sendStroke = (x0, y0, x1, y1, lStyle, lOpacity, sColour, lWidth) => {
    if (socket && !isLocal) {
      let canvasStroke = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        lineStyle: lStyle,
        lineOpacity: lOpacity,
        strokeColour: sColour,
        lineWidth: lWidth,
      };

      socket.emit("sendStroke", canvasStroke);
    }
  };

  const saveCanvas = async () => {
    await axios.post('http://localhost:3001/graphql', {
      query: `mutation {
        updateCanvas(input: {title: "${location.state.title}", thumbnailPath:"${document.getElementById("main-canvas").toDataURL("image/png", 0.5)}"}){
          title
        }
      }`
    },
      { withCredentials: true },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  }

  const beginDraw = (e) => {
    currentX = e.pageX;
    currentY = e.pageY;
    setIsDrawing(true);
  };

  const endDraw = (e) => {
    if (isDrawing) {
      drawBrush(e);
      saveCanvas();
      setIsDrawing(false);
    }
  };

  const drawLine = (e) => {
    if (isDrawing) {
      drawBrush(e);
      currentX = e.pageX;
      currentY = e.pageY;
    }
  };

  const drawBrush = (e) => {
    if (isGradientBrush) {
      var gradientStroke = `hsl(${hue}, 100%, 50%)`;
      drawing(
        currentX,
        currentY,
        e.pageX,
        e.pageY,
        lineStyle,
        1,
        gradientStroke,
        lineWidth,
        true
      );
      setHue(hue + 1);
      if (hue >= 360) {
        setHue(0);
      }
    } else if (isPencil) {
      drawing(
        currentX,
        currentY,
        e.pageX,
        e.pageY,
        lineStyle,
        lineOpacity,
        strokeColour,
        1,
        true
      );
    } else if (isEraser) {
      drawing(
        currentX,
        currentY,
        e.pageX,
        e.pageY,
        lineStyle,
        1,
        "#FFFFFF",
        lineWidth,
        true
      );
    } else {
      drawing(
        currentX,
        currentY,
        e.pageX,
        e.pageY,
        lineStyle,
        lineOpacity,
        strokeColour,
        lineWidth,
        true
      );
    }
  };

  const drawing = (
    x0,
    y0,
    x1,
    y1,
    lStyle,
    lOpacity,
    sColour,
    lWidth,
    toSend
  ) => {
    const canvasContext = canvasRef.current.getContext("2d");
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    canvasContext.lineCap = lStyle;
    canvasContext.globalAlpha = lOpacity;
    canvasContext.strokeStyle = sColour;
    // canvasContext.shadowBlur = 100;
    // canvasContext.shadowColor = sColour;
    canvasContext.lineWidth = lWidth;
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath();

    if (toSend) {
      sendStroke(x0, y0, x1, y1, lStyle, lOpacity, sColour, lWidth);
    }
  };

  const changeStrokeType = (strokeType) => {
    setIsDefaultBrush(false);
    setIsPencil(false);
    setIsGradientBrush(false);
    setIsEraser(false);
    document.getElementById("default-brush").style.backgroundSize = "";
    document.getElementById("pencil-brush").style.backgroundSize = "";
    document.getElementById("gradient-brush").style.backgroundSize = "";
    document.getElementById("eraser-button").style.backgroundSize = "";
    if (strokeType == DEFAULT) {
      setIsDefaultBrush(true);
      document.getElementById("default-brush").style.backgroundSize =
        "100% 5px, auto";
    } else if (strokeType == PENCIL) {
      setIsPencil(true);
      document.getElementById("pencil-brush").style.backgroundSize =
        "100% 5px, auto";
    } else if (strokeType == GRADIENT) {
      setIsGradientBrush(true);
      document.getElementById("gradient-brush").style.backgroundSize =
        "100% 5px, auto";
    } else if (strokeType == ERASER) {
      setIsEraser(true);
      document.getElementById("eraser-button").style.backgroundSize =
        "100% 5px, auto";
    }
  };

  // const history = useHistory();
  const history = createBrowserHistory({
    forceRefresh: true
  });
  
  function exitCanvas() {

    history.push("/galleries");
  }

  return (
    <div>
      <div id="exit-button" onClick={exitCanvas}>
      </div>
      <div id="toolbar-container">
        <ColorPicker
          setStrokeColour={setStrokeColour}
          setLineOpacity={setLineOpacity}
        />
        <StrokeSizeSelector setLineWidth={setLineWidth} lineWidth={lineWidth} />
        {/* <p>Tools</p> */}
        <div id="toolbar-tools">
          <div
            id="default-brush"
            className="canvas-tools"
            onClick={() => changeStrokeType(DEFAULT)}
          ></div>
          <div
            id="pencil-brush"
            className="canvas-tools"
            onClick={() => changeStrokeType(PENCIL)}
          ></div>
          <div
            id="gradient-brush"
            className="canvas-tools"
            onClick={() => changeStrokeType(GRADIENT)}
          >
            Gradient
          </div>
          <div
            id="eraser-button"
            className="canvas-tools"
            onClick={() => changeStrokeType(ERASER)}
          >
            Eraser
          </div>
        </div>
      </div>
      {/* <Chat /> */}
      <canvas
        id="main-canvas"
        ref={canvasRef}
        onMouseDown={beginDraw}
        onMouseUp={endDraw}
        onMouseMove={drawLine}
      ></canvas>
    </div>
  );
}

export default Canvas;
