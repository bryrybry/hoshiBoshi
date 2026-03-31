/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import Grid from './Grid.jsx';
import TopText from './TopText.jsx';
import styles from './stylesheets/Hoshi.module.css'
import { solve } from './Solver.js';
import EditPanel from './EditPanel.jsx';
import { EMPTY, DOT, STAR } from "./Grid";
import { FaTrash } from "react-icons/fa";

// TEMPORARY:
import seedrandom from 'seedrandom';

const Hoshi = () => {
  // TEMPORARY:
  const rng = seedrandom('bryry');
  const rng_list = Array.from({ length: 11 }, () =>
    Array.from({ length: 3 }, rng)
  );
  const index_map = [
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1,
    3, 3, 3, 2, 2, 2, 2, 0, 1, 1, 1,
    3, 3, 3, 2, 4, 4, 4, 0, 0, 0, 1,
    3, 3, 3, 2, 4, 5, 4, 0, 6, 6, 6,
    3, 7, 7, 7, 4, 5, 4, 0, 6, 8, 8,
    3, 7, 7, 7, 4, 5, 4, 0, 6, 6, 6,
    7, 7, 7, 7, 4, 4, 4, 0, 6, 9, 9,
    10, 10, 10, 7, 7, 7, 0, 0, 6, 6, 6,
    10, 10, 10, 10, 10, 7, 10, 0, 0, 0, 0,
    10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0,
  ];
  // const index_map = [
  // 0, 0, 0, 1, 1,
  // 2, 1, 1, 1, 3,
  // 2, 1, 4, 3, 3,
  // 4, 4, 4, 3, 3,
  // 4, 4, 4, 4, 4,
  // ]
  function getNewCell(index, colorId, rng) {
    return {
      index,
      state: EMPTY,
      colorId,
      rgb: {
        r: Math.floor(rng[0] * 255),
        g: Math.floor(rng[1] * 255),
        b: Math.floor(rng[2] * 255)
      }
    };
  }

  const INITIAL_GRID_SIZE = 11;
  const [colorList, setColorList] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isReadyToSolve, setIsReadyToSolve] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [gridSideLength, setGridSideLength] = useState(INITIAL_GRID_SIZE);
  const [sizeInputField, setSizeInputField] = useState(INITIAL_GRID_SIZE);
  const [cellGrid, setCellGrid] = useState(() =>
    Array.from({ length: gridSideLength * gridSideLength },
      (_, index) => getNewCell(index, index_map[index], rng_list[index_map[index]])
    )
  );

  useEffect(() => {

  }, [])

  function onSolveButtonClick() {
    setIsSolving(true);
    solve(cellGrid, setCellGrid, gridSideLength);
  }

  return (
    <div className={styles.hoshi}>
      <div style={{ flex: 1 }}>
        <TopText
          cellGrid={cellGrid}
          GRID_SIDE_LENGTH={gridSideLength}
          setIsReadyToSolve={setIsReadyToSolve}
          isSolving={isSolving} />
      </div>
      <div style={{ flex: 3 }} className={styles.middleRow}>
        <Grid
          cellGrid={cellGrid}
          setCellGrid={setCellGrid}
          selectedColor={selectedColor}
          GRID_SIDE_LENGTH={gridSideLength} />
        <div style={{ flex: 1, height: '100%' }}>
          <div className={styles.sidebar}>
            <div className={styles.sizeWrapper}>
              <div>
                Size
              </div>
              <input
                className={styles.sizeInput}
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
                        newCellGrid.splice(row*oldSize-diff, diff);
                      }
                      setCellGrid(newCellGrid);
                    }
                    setGridSideLength(newSize);
                  }
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
            GRID_SIDE_LENGTH={gridSideLength}
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
