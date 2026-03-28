/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import styles from "./stylesheets/TopText.module.css"
import { EMPTY, DOT, STAR } from "./Grid";

const TopText = ({ cellGrid, GRID_SIDE_LENGTH, setIsReadyToSolve, isSolving }) => {
    const [content, setContent] = useState("");
    useEffect(() => {
        console.log("chhekcing")
        console.log(cellGrid)
        setContent(() => {
            if (!cellsFilled) return <h3>Fill in the cells.</h3>;
            if (!allColorsUsed) return <h3>{`Not all colors were used! [${colorsUsedCount}/${GRID_SIDE_LENGTH}]`}</h3>;
            if (isSolving && !isSolved()) return <h3>Now Solving...</h3>
            if (isSolving && isSolved()) return <h3>Solved it!</h3>
            return <h3 onClick={() => {
                console.log(cellGrid)
            }}>Ready to Solve!</h3>
        });
        setIsReadyToSolve(cellsFilled && allColorsUsed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cellGrid])

    const cellsFilled = (cellGrid.filter(
        cell => typeof cell === 'object' && cell !== null && Object.keys(cell).length > 0
    )).length === GRID_SIDE_LENGTH * GRID_SIDE_LENGTH;

    const colorsUsedCount = new Set(cellGrid
        .filter(cell => cell && cell.colorId !== undefined)
        .map(cell => cell.colorId)).size;
    const allColorsUsed = colorsUsedCount === GRID_SIDE_LENGTH;
    const isSolved = () => {
        const _cellGrid = [...cellGrid];

        const cellGridRows = [];
        for (let i = 0; i < _cellGrid.length; i += GRID_SIDE_LENGTH) {
            const chunk = _cellGrid.slice(i, i + GRID_SIDE_LENGTH);
            cellGridRows.push(chunk);
        }
        const rowsSolved = cellGridRows.filter(row => row.filter(cell => cell.state === STAR).length === 1).length === GRID_SIDE_LENGTH;

        const cellGridCols = Array(GRID_SIDE_LENGTH).fill().map(() => []);
        for (let i = 0; i < _cellGrid.length; i++) {
            cellGridCols[i % GRID_SIDE_LENGTH].push(_cellGrid[i]);
        }
        const colsSolved = cellGridCols.filter(col => col.filter(cell => cell.state === STAR).length === 1).length === GRID_SIDE_LENGTH;

        const cellGridColors = Array(GRID_SIDE_LENGTH).fill().map(() => []);
        for (let i = 0; i < _cellGrid.length; i++) {
            cellGridColors[_cellGrid[i].colorId].push(_cellGrid[i]);
        }
        const colorsSolved = cellGridColors.filter(col => col.filter(cell => cell.state === STAR).length === 1).length === GRID_SIDE_LENGTH;

        return (rowsSolved && colsSolved && colorsSolved);
    }

    return (
        <div className={styles.topText}>
            {content}
        </div>
    );
}

export default TopText