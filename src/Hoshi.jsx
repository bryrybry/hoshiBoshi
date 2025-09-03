/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import Grid from './Grid.jsx';
import TopText from './TopText.jsx';
import ColorPanel from './ColorPanel.jsx';
import styles from './stylesheets/Hoshi.module.css'
import { solve } from './Solver.js';

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
      isStar: false,
      isDot: false,
      colorId,
      rgb: {
        r: Math.floor(rng[0] * 255),
        g: Math.floor(rng[1] * 255),
        b: Math.floor(rng[2] * 255)
      }
    };
  }

  const GRID_SIDE_LENGTH = 11;
  const [cellGrid, setCellGrid] = useState(
    Array.from({ length: GRID_SIDE_LENGTH * GRID_SIDE_LENGTH }, (_, index) => getNewCell(index, index_map[index], rng_list[index_map[index]]))
  );
  const [colorList, setColorList] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isReadyToSolve, setIsReadyToSolve] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  function onSolveButtonClick() {
    setIsSolving(true);
    solve(cellGrid, setCellGrid, GRID_SIDE_LENGTH);
  }

  return (
    <div className={styles.hoshi}>
      <div style={{ flex: 2 }}>
        <TopText
          cellGrid={cellGrid}
          GRID_SIDE_LENGTH={GRID_SIDE_LENGTH}
          setIsReadyToSolve={setIsReadyToSolve}
          isSolving={isSolving} />
      </div>
      <div style={{ flex: 6 }}>
        <Grid
          cellGrid={cellGrid}
          setCellGrid={setCellGrid}
          selectedColor={selectedColor}
          GRID_SIDE_LENGTH={GRID_SIDE_LENGTH} />
      </div>
      <div style={{ flex: 2 }}>
        {!isReadyToSolve ?
          <ColorPanel
            GRID_SIDE_LENGTH={GRID_SIDE_LENGTH}
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
