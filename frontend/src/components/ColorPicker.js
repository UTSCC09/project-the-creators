import React, { useState } from 'react';
import '../styles/ColorPicker.css';
import ChromePicker from 'react-color';

function ColorPicker({setStrokeColour, setLineOpacity}) {
    const [colorState, setColorState] = useState({
        display: false,
        colorHex: '#000000',
        color: {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        }
    });

    const displayColorPicker = () => {
        setColorState({...colorState, "display": !colorState.display });
    }

    const changeColor = (color) => {
        setColorState({...colorState, "color": color.rgb, "colorHex": color.hex});
        document.getElementById("color-picker-button").style.background = colorState.colorHex;
        setStrokeColour(colorState.colorHex);
        setLineOpacity(colorState.color.a);
    }

    const handleClose = () => {
        setColorState({...colorState, "display": false });
    }

    return (
        <div id='color-picker'>
            <div id='color-picker-button' onClick={ displayColorPicker }>
            </div>
            { colorState.display ? 
            <div id='color-picker-box'>
            <div id='color-picker-cover' onClick={ handleClose }/>
            <ChromePicker color={ colorState.color } onChange={ changeColor } />
            </div>
            : null }
        </div>
    )
}

export default ColorPicker