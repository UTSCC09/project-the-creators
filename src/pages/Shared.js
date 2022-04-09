import { authUrl } from "../lib/constants.js";
import React, { useEffect } from "react";
import axios from "axios";
import "../styles/Gallery.css";
import { useHistory } from "react-router-dom";

let currentUser = "";

const Shared = () => {

  const setupGallery = async () => {
    const currentUser = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")

      const data = await axios.post('http://localhost:3001/graphql', {
        query: `{
          getAllCanvases(isShared: true){
            _id
            title
            creator
            thumbnailPath
          }
        }
        `,
        variables: null
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    var canvases = data.data.data.getAllCanvases;

    let innerElmnt = ``;

    for (var i in canvases) {
      innerElmnt += `<div id='shared-canvas${i}'class='shared-user-gallery-card'>
                          <div class='user-gallery-card-image' style="content:url(${canvases[i].thumbnailPath})">
                          </div>
                          <div class='user-gallery-card-name'>
                            ${canvases[i].title}
                          </div>
                        `;
    }
    document.getElementById('user-shared-gallery').insertAdjacentHTML('afterbegin', innerElmnt);

    var index = 0;
    document.querySelectorAll('.shared-user-gallery-card').forEach(item => {
      var id = canvases[index]._id;
      item.addEventListener('click', event => {
        history.push("/canvas", { identifier: id });
      });
      index++;
    });
  };

  const createCanvas = async () => {

    var inputVal = document.getElementById('shared-canvas-title').value;
    if(inputVal){
      var ret = await axios.post('http://localhost:3001/graphql', {
      query: `mutation {
        createCanvas(input: {creator: "${currentUser}", title: "${inputVal}", isShared: true}) {
          _id
        }
      }`
    },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(ret){
        history.push("/canvas", { identifier: ret.data.data.createCanvas._id});
      }
    }
  };

  const history = useHistory();
 
  function createProject() {

    document.getElementById('shared-canvas-form').style.display = 'flex';
    document.getElementById('add-shared-canvas').style.display = 'none';
  }

  function cancelCreation() {
    document.getElementById('shared-canvas-form').style.display = 'none';
    document.getElementById('add-shared-canvas').style.display = 'flex';
  }

  useEffect(() => {
    setupGallery();
  }, []);

  return (
    <div id='user-shared-gallery' className='user-gallery'>

      <div id='add-shared-canvas' className='user-gallery-add' onClick={createProject}>
        <div className='user-gallery-add-image'>
        </div>
      </div>
      <div id='shared-canvas-form' className='create-canvas-form'>
        <input type="text" id="shared-canvas-title" placeholder="Enter a title for your canvas"></input>
        <div className='canvas-button-container'>
          <button className='canvas-form-button' onClick={createCanvas}>Submit</button>
          <button className='canvas-form-button' onClick={cancelCreation}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Shared;
