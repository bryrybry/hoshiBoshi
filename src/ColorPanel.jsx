/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import styles from './stylesheets/ColorPanel.module.css'
import seedrandom from 'seedrandom';

const ColorPanel = ({ GRID_SIDE_LENGTH, colorList, setColorList, selectedColor, setSelectedColor }) => {
    function getNewCell(index, rng) {
        return {
            id: index,
            rgb: {
                r: Math.floor(rng() * 255),
                g: Math.floor(rng() * 255),
                b: Math.floor(rng() * 255)
            },
            isStar: false,
            isDot: false
        };
    }
    useEffect(() => {
        const rng = seedrandom('bryry');
        const newColors = Array.from({ length: GRID_SIDE_LENGTH }, (_, index) => getNewCell(index, rng));
        console.log(newColors)
        setColorList(newColors);
    }, []);

    return (
        <div className={styles.colorPanel}>
            {colorList.map((color, index) => (
                <div
                    key={index}
                    className={`${styles.colorCircle} 
                    ${(selectedColor && selectedColor.id === color.id) && styles.selected}`}
                    style={{
                        background: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
                    }}
                    onClick={() => setSelectedColor(color)} />
            ))}
        </div>
    );
}

export default ColorPanel;
