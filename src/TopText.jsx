/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import styles from "./stylesheets/TopText.module.css"
import { EMPTY, DOT, STAR } from "./Grid";

const TopText = ({ cellGrid, gridSideLength, setIsReadyToSolve, isSolving }) => {
    const [content, setContent] = useState("");
    useEffect(() => {
        setContent(() => {
            if (!cellsFilled) return <h3>Fill in the cells.</h3>;
            if (!allColorsUsed) return <h3>{`Not all colors were used! [${colorsUsedCount}/${gridSideLength}]`}</h3>;
            if (isSolving && !isSolved()) return <h3>Now Solving...</h3>
            if (isSolving && isSolved()) return <h3>Solved it!</h3>
            return <h3>Ready to Solve!</h3>
        });
        setIsReadyToSolve(cellsFilled && allColorsUsed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cellGrid])

    const cellsFilled = (cellGrid.filter(
        cell => typeof cell === 'object' && cell !== null && Object.keys(cell).length > 0
    )).length === gridSideLength * gridSideLength;

    const colorsUsedCount = new Set(cellGrid
        .filter(cell => cell && cell.colorId !== undefined)
        .map(cell => cell.colorId)).size;
    const allColorsUsed = colorsUsedCount === gridSideLength;
    const isSolved = () => {
        const _cellGrid = [...cellGrid];

        const cellGridRows = [];
        for (let i = 0; i < _cellGrid.length; i += gridSideLength) {
            const chunk = _cellGrid.slice(i, i + gridSideLength);
            cellGridRows.push(chunk);
        }
        const rowsSolved = cellGridRows.filter(row => row.filter(cell => cell.state === STAR).length === 1).length === gridSideLength;

        const cellGridCols = Array(gridSideLength).fill().map(() => []);
        for (let i = 0; i < _cellGrid.length; i++) {
            cellGridCols[i % gridSideLength].push(_cellGrid[i]);
        }
        const colsSolved = cellGridCols.filter(col => col.filter(cell => cell.state === STAR).length === 1).length === gridSideLength;

        const cellGridColors = Array(gridSideLength).fill().map(() => []);
        for (let i = 0; i < _cellGrid.length; i++) {
            cellGridColors[_cellGrid[i].colorId].push(_cellGrid[i]);
        }
        const colorsSolved = cellGridColors.filter(col => col.filter(cell => cell.state === STAR).length === 1).length === gridSideLength;

        return (rowsSolved && colsSolved && colorsSolved);
    }

    return (
        <div className={styles.topText}>
            {content}
        </div>
    );
}

export default TopText