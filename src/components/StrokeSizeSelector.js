import React, { useState } from 'react';
import '../styles/StrokeSizeSelector.css';
import Slider from '@mui/material/Slider';

function StrokeSizeSelector({setLineWidth, lineWidth}) {

    const displaySizeSelector = () => {
        document.getElementById('brush-size-box').style.display = 'flex';
    }

    const handleChange = (e, val) => {
        setLineWidth(val);
        document.getElementById('preview-stroke').style.width = `${val}px`;
        document.getElementById('preview-stroke').style.height = `${val}px`;
    }

    const handleClose = () => {
        document.getElementById('brush-size-box').style.display = 'none';
    }


    return (
        <div id='brush-size-container'>
            <div id='brush-size-button' onClick={ displaySizeSelector }/>
            <div id='brush-size-box'>
                <div id='brush-size-cover' onClick={ handleClose }/>
                <div id='preview-box'>
                    <div id='preview-stroke'></div>
                </div>
                <div id='slider-box'>
                    <Slider id='brush-size-slider' min={10} max={75} default={lineWidth}
                    aria-label="Default" valueLabelDisplay="auto" onChange={ handleChange }/>
                </div>
            </div> 
        </div>
    )
}

export default StrokeSizeSelector