import React, { useEffect } from "react";
import axios from "axios";
import { authUrl } from "../lib/constants.js";
import '../styles/Gallery.css';
import { useHistory } from "react-router-dom";

let currentUser = "";

const Local = () => {
  const setupGallery = async () => {
    await axios
      .get(authUrl + "/currentUser", { withCredentials: true })
      .then((res) => {
        if (res.data !== "") {
          currentUser = res.data;
        }
      });
    const data = await axios.post('http://localhost:3001/graphql', {
      query: `{
        getAllCanvases(isShared: false){
          _id
          title
          creator
          thumbnailPath
        }
      }
      `,
      variables: null
    },
    { withCredentials: true },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    var canvases = data.data.data.getAllCanvases;

    let innerElmnt = ``;

    for (var i in canvases) {
      innerElmnt += `<div id='local-canvas${i}'class='local-user-gallery-card'>
                          <div class='user-gallery-card-image' style="content:url(${canvases[i].thumbnailPath})">
                          </div>
                          <div class='user-gallery-card-name'>
                            ${canvases[i].title}
                          </div>
                        </div>`;
    }
    document.getElementById('user-local-gallery').insertAdjacentHTML('afterbegin', innerElmnt);

    var index = 0;
    document.querySelectorAll('.local-user-gallery-card').forEach(item => {
      var id = canvases[index]._id;
      item.addEventListener('click', event => {
        history.push("/canvas", { identifier: id });
      });
      index++;
    });

  };

  const createCanvas = async () => {
    
    var inputVal = document.getElementById('local-canvas-title').value;
    if(inputVal){
      var ret = await axios.post('http://localhost:3001/graphql', {
      query: `mutation {
        createCanvas(input: {creator: "${currentUser}", title: "${inputVal}", isShared: false}) {
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
        history.push("/canvas", { identifier: ret.data.data.createCanvas._id});
      }
    }
  };

  const history = useHistory();

  function createProject() {

    document.getElementById('local-canvas-form').style.display = 'flex';
    document.getElementById('add-local-canvas').style.display = 'none';
  }

  function cancelCreation() {
    document.getElementById('local-canvas-form').style.display = 'none';
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
      <div id='local-canvas-form' className='create-canvas-form'>
        <input type="text" id="local-canvas-title" placeholder="Enter a title for your canvas"></input>
        <div className='canvas-button-container'>
          <button className='canvas-form-button' onClick={createCanvas}>Submit</button>
          <button className='canvas-form-button' onClick={cancelCreation}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Local;
