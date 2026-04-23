/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import Grid from './Grid.jsx';
import TopText from './TopText.jsx';
import styles from './stylesheets/Hoshi.module.css'
import { solve } from './Solver.js';
import EditPanel from './EditPanel.jsx';
import { EMPTY, DOT, STAR } from "./Grid";
import { FaTrash } from "react-icons/fa";
import presets from "./datasets/presets.js";

// TEMPORARY:
import seedrandom from 'seedrandom';

const Hoshi = () => {
  const INITIAL_GRID_SIZE = 8;
  const [colorList, setColorList] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isReadyToSolve, setIsReadyToSolve] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [gridSideLength, setGridSideLength] = useState(INITIAL_GRID_SIZE);
  const [sizeInputField, setSizeInputField] = useState(INITIAL_GRID_SIZE);
  const [presetInputField, setPresetInputField] = useState(0);
  const [cellGrid, setCellGrid] = useState(() =>
    Array(gridSideLength * gridSideLength).fill(null).map(() => ({}))
  );

  useEffect(() => {
    console.log(cellGrid);
  }, [cellGrid])

  function onSolveButtonClick() {
    setIsSolving(true);
    solve(cellGrid, setCellGrid, gridSideLength);
  }

  return (
    <div className={styles.hoshi}>
      <div style={{ flex: 1 }}>
        <TopText
          cellGrid={cellGrid}
          gridSideLength={gridSideLength}
          setIsReadyToSolve={setIsReadyToSolve}
          isSolving={isSolving} />
      </div>
      <div style={{ flex: 3 }} className={styles.middleRow}>
        <Grid
          cellGrid={cellGrid}
          setCellGrid={setCellGrid}
          selectedColor={selectedColor}
          gridSideLength={gridSideLength} />
        <div style={{ flex: 1, height: '100%' }}>
          <div className={styles.sidebar}>
            <div className={styles.pushTopWrapper}>
              <div>
                Size
              </div>
              <input
                className={styles.sidebarInput}
                type="number"
                maxLength={2}
                value={sizeInputField}
                onChange={(e) => {
                  const oldSize = gridSideLength;
                  const newSize = e.target.value.slice(0, 2);
                  setSizeInputField(newSize);
                  if (newSize >= 5 && newSize != oldSize) {
                    const diff = Math.abs(newSize - oldSize);
                    if (newSize > oldSize) {
                      // size increased
                      let newCellGrid = [...cellGrid];
                      for (let row = oldSize; row > 0; row--) {
                        for (let _ = 0; _ < diff; _++) {
                          newCellGrid.splice(row * oldSize, 0, {})
                        }
                      }
                      newCellGrid.push(...Array(newSize * diff).fill({}));
                      setCellGrid(newCellGrid);
                    } else {
                      // size decreased
                      let newCellGrid = [...cellGrid];
                      const x = oldSize * diff;
                      newCellGrid.splice(-x, x);
                      for (let row = newSize; row > 0; row--) {
                        newCellGrid.splice(row * oldSize - diff, diff);
                      }
                      setCellGrid(newCellGrid);
                    }
                    setGridSideLength(newSize);
                  }
                }} />
              <div>
                Preset
              </div>
              <input
                className={styles.sidebarInput}
                type="number"
                maxLength={2}
                value={presetInputField}
                onChange={(e) => {
                  const newValue = e.target.value.slice(0, 2);
                  setPresetInputField(newValue);
                  if (newValue <= 0 || newValue > presets.length) return;
                  const preset = presets[newValue - 1];
                  setGridSideLength(Math.sqrt(preset.length));
                  setCellGrid(preset.map((cellId, index) => {
                    return {
                      index: index,
                      state: EMPTY,
                      ...selectedColor
                    };
                  }))
                }} />
            </div>
            <div style={{ height: '0.2rem' }} />
            {!cellGrid.every(obj => Object.keys(obj).length === 0) &&
              <button className={styles.clearButton} title="Clear Grid" onClick={() => {
                setCellGrid(Array.from({ length: gridSideLength * gridSideLength },
                  (_) => ({})
                ))
              }}>
                <FaTrash />
              </button>}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {!isReadyToSolve ?
          <EditPanel
            gridSideLength={gridSideLength}
            colorList={colorList}
            setColorList={setColorList}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor} /> :
          <div className={styles.solveButtonWrapper}>
            <button
              className={`${styles.solveButton} ${isSolving ? styles.clicked : ""}`}
              onClick={onSolveButtonClick}>
              Solve
            </button>
          </div>
        }
      </div>
    </div>
  );
}

export default Hoshi;
