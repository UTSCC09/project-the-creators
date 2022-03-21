import React from 'react';
import '../styles/ColorSelector.css';

function ColorSelector({setStrokeColour}) {
    return (
        <div id='colour-selector'>
            <div id='colour-red'
                style={{background: 'red'}}
                onClick={() => setStrokeColour('red')}
            >
            </div>
            <div id='colour-blue'
                style={{background: 'blue'}}
                onClick={() => setStrokeColour('blue')}
            >
            </div>
            <div id='colour-black'
                style={{background: 'black'}}
                onClick={() => setStrokeColour('black')}
            >
            </div>
        </div>
    )
}

export default ColorSelector