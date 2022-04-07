import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CardGroup, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../lib/constants.js";
import '../styles/Gallery.css';
import { get } from "react-hook-form";
import { useHistory } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex";

const Local = () => {
  const setupGallery = async () => {
    const data = await axios.post('http://localhost:3001/graphql', {
      query: `{getCanvases(creator: "jadin", isShared: false) {_id, title, creator, thumbnailPath}}`,
      variables: null
    },
    { withCredentials: true },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // console.log(data);
    var canvases = data.data.data.getCanvases;
    console.log(canvases);

    let innerElmnt = ``;

    for (var i in canvases) {
      console.log(canvases[i].title);
      innerElmnt += `<div id='local-canvas${i}'class='user-gallery-card'>
                          <div class='user-gallery-card-image' style="content:url(${canvases[i].thumbnailPath})">
                          </div>
                          <div class='user-gallery-card-name'>
                            ${canvases[i].title}
                          </div>
                        </div>`;
    }
    document.getElementById('user-local-gallery').insertAdjacentHTML('afterbegin', innerElmnt);

    var index = 0;
    console.log(document.querySelectorAll('.user-gallery-card'));

    document.querySelectorAll('.user-gallery-card').forEach(item => {
      var title = canvases[index].title;
      item.addEventListener('click', event => {
                history.push("/canvas", { creator:"jadin", title: title });
      });
      index++;
    });

  };

  const createCanvas = async () => {
    
    var inputVal = document.getElementById('canvas-title').value;
    if(inputVal){
      var ret = await axios.post('http://localhost:3001/graphql', {
      query: `mutation {
        createCanvas(input: {title: "${inputVal}", isShared: false}) {
          _id
        }
      }`
    },
      { withCredentials: true },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(ret){
        history.push("/canvas", { creator:"jadin", title: inputVal});
      }
    } else {
      console.log("test");
    }
  }

  const history = useHistory();

  function createProject() {

    document.getElementById('canvas-form').style.display = 'flex';
    document.getElementById('add-local-canvas').style.display = 'none';
  }

  function cancelCreation() {
    document.getElementById('canvas-form').style.display = 'none';
    document.getElementById('add-local-canvas').style.display = 'flex';
  }

  useEffect(() => {
    setupGallery();
  }, []);

  return (
    <div id='user-local-gallery' className='user-gallery'>

      <div id='add-local-canvas' className='user-gallery-add' onClick={createProject}>
        <div className='user-gallery-add-image'>
        </div>
      </div>
      <div id='canvas-form' className='create-canvas-form'>
        <input type="text" id="canvas-title" placeholder="Enter a title for your canvas"></input>
        <div className='canvas-button-container'>
          <button className='canvas-form-button' onClick={createCanvas}>Submit</button>
          <button className='canvas-form-button' onClick={cancelCreation}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Local;
