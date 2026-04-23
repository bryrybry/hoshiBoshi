
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styles from './stylesheets/ColorPanel.module.css'
import seedrandom from 'seedrandom';
import { IoGridOutline } from "react-icons/io5";

const EditPanel = ({ gridSideLength, colorList, setColorList, selectedColor, setSelectedColor }) => {
    return (
        <>
            <ColorPanel
                gridSideLength={gridSideLength}
                colorList={colorList}
                setColorList={setColorList}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor} />
        </>
    )
}

const ColorPanel = ({ gridSideLength, colorList, setColorList, selectedColor, setSelectedColor }) => {
    function getNewCell(colorId, rng) {
        return {
            colorId,
            rgb: {
                r: Math.floor(rng() * 256),
                g: Math.floor(rng() * 256),
                b: Math.floor(rng() * 256)
            }
        };
    }
    useEffect(() => {
        const rng = seedrandom('bryry');
        const newColors = Array.from({ length: gridSideLength }, (_, index) => getNewCell(index, rng));
        setColorList(newColors);
    }, [gridSideLength]);

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

export default EditPanel;
