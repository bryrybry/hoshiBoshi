/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styles from './stylesheets/ColorPanel.module.css'
import seedrandom from 'seedrandom';

const ColorPanel = ({ GRID_SIDE_LENGTH, colorList, setColorList, selectedColor, setSelectedColor }) => {
    function getNewCell(colorId, rng) {
        return {
            colorId,
            rgb: {
                r: Math.floor(rng() * 255),
                g: Math.floor(rng() * 255),
                b: Math.floor(rng() * 255)
            }
        };
    }
    useEffect(() => {
        const rng = seedrandom('bryry');
        const newColors = Array.from({ length: GRID_SIDE_LENGTH }, (_, index) => getNewCell(index, rng));
        setColorList(newColors);
    }, []);

    return (
        <div className={styles.colorPanel}>
            {colorList.map((color, index) => (
                <div
                    key={index}
                    className={`${styles.colorCircle} 
                    ${(selectedColor && selectedColor.colorId === color.colorId) && styles.selected}`}
                    style={{
                        background: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
                    }}
                    onClick={() => setSelectedColor(color)} />
            ))}
        </div>
    );
}

export default ColorPanel;
