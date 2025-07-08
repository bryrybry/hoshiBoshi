/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styles from './stylesheets/Grid.module.css';
import './stylesheets/global.css'
import { index_to_column, index_to_row } from "./helper/GridDecoder.js";
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const Grid = ({ cellGrid, setCellGrid, selectedColor, GRID_SIDE_LENGTH }) => {
  const GRID_REAL_SIDE_LENGTH = GRID_SIDE_LENGTH * 2 + 1;
  const REAL_GRID_SIZE = GRID_REAL_SIDE_LENGTH * GRID_REAL_SIDE_LENGTH;

  const borderSize = 5 / (GRID_REAL_SIDE_LENGTH + 1) * 2;
  const cellSize = 95 / (GRID_REAL_SIDE_LENGTH - 1) * 2;

  const generateTrackSizes = () =>
    Array.from({ length: GRID_REAL_SIDE_LENGTH }, (_, i) =>
      i % 2 === 0 ? `${borderSize}%` : `${cellSize}%`
    ).join(" ");

  const gridStyles = {
    "--gridRealSideLength": GRID_REAL_SIDE_LENGTH,
    gridTemplateColumns: generateTrackSizes(),
    gridTemplateRows: generateTrackSizes(),
  };

  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0) setMouseDown(true); // only for m1 clicks
    };
    const handleMouseUp = () => setMouseDown(false);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={styles.grid} style={gridStyles}>
      {Array.from({ length: REAL_GRID_SIZE }, (_, index) => {
        const isColumnBorder = index_to_column(index, GRID_REAL_SIDE_LENGTH) % 2 === 0;
        const isRowBorder = index_to_row(index, GRID_REAL_SIDE_LENGTH) % 2 === 0;
        const isBorder = isColumnBorder || isRowBorder;
        const col = index_to_column(index, GRID_REAL_SIDE_LENGTH);
        const row = index_to_row(index, GRID_REAL_SIDE_LENGTH);
        if (!isBorder) {
          const realCol = (col - 1) / 2;
          const realRow = (row - 1) / 2;
          const cellIndex = realRow * GRID_SIDE_LENGTH + realCol;
          return (
            <Cell
              key={index}
              cellData={cellGrid[cellIndex]}
              mouseDown={mouseDown}
              selectedColor={selectedColor}
              setCellGrid={() => {
                if (selectedColor) {
                  setCellGrid(prev => {
                    const prevList = [...prev];
                    prevList[cellIndex] = { ...selectedColor };
                    return prevList;
                  });
                }
              }}
              clearCellGrid={() => {
                setCellGrid(prev => {
                  const prevList = [...prev];
                  prevList[cellIndex] = {};
                  return prevList;
                });
              }}
            />
          );
        } else {
          // border
          return (
            <Border
              key={index}
              fullGridIndex={index}
            />
          );
        }
      })}
    </div>
  );
};


const Cell = ({ cellData, mouseDown, selectedColor, setCellGrid, clearCellGrid }) => {
  const safeCellData = cellData || {};
  return (
    <div
      className={`${styles.cell} ${selectedColor ? styles.clickable : ''}`}
      style={{
        background: Object.keys(safeCellData).length === 0 ? 'transparent' :
          `rgba(${safeCellData.rgb.r}, ${safeCellData.rgb.g}, ${safeCellData.rgb.b}, 0.5)`
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        if (e.button === 0) { // only left click triggers coloring
          setCellGrid();
        }
      }}
      onMouseEnter={() => {
        if (mouseDown) setCellGrid();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        clearCellGrid();
      }} >
        {cellData.isStar ? <FaStar/> : cellData.isDot ? <GoDotFill/> : <div/>}
      </div>
  );
};


const Border = ({ fullGridIndex }) => {
  return (
    <div className={styles.border}
      onMouseDown={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()} />
  );
}

export default Grid;
