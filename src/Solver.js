import { FaLastfmSquare } from "react-icons/fa";
import { areListsEqual } from "./helper/MiscHelper";

let allCells = [];
let sideLength;
let arrayGroupIndices = [];
// arrayGroupIndices is based off sideLength. Example:
// If the side length is 4, then arrayGroupIndices will be:
// [ [0], [1], [2], [3], [0, 1], [1, 2], [2, 3], [0, 1, 2], [1, 2, 3] ]
let arrayGroupSlices = [];
// Same thing as above, but used for the .slice(start, end) method.
let cellsByRow = [], cellsByCol = [];

let loopSolve = true;

export function solve(importedCellGrid, setCellGrid, length) {
    allCells = [...importedCellGrid]; // cuz the imported one cant be edited, so u make copy
    sideLength = length;
    arrayGroupIndices = generateArrayGroupIndices(length);
    arrayGroupSlices = generateArrayGroupSlices(arrayGroupIndices);

    let cellGridClone = allCells.slice(); // clone array
    while (cellGridClone.length) cellsByRow.push(cellGridClone.splice(0, length)); // generate horizontal 2d matrix
    cellsByCol = cellsByRow[0].map((_, colIndex) => cellsByRow.map(row => row[colIndex])); // generate horizontal 2d matrix

    loopSolve = true;
    while (loopSolve) {
        loopSolve = false;
        const _allCells = [...allCells];
        // solve functions
        // solidColours(length);
        obviousStar();
        occupiedRegionsB();
        // end
        if (!areListsEqual(_allCells, allCells)) loopSolve = true;
    }

    // use setCellGrid(new_grid) to change the grid or smth
}

function dotCells(indices) {
    for (const index of indices) {
        allCells[index].isDot = true;
    }
    console.log(`Dotting cells: ${indices}`)
}

function starCells(indices) {
    for (const index of indices) {
        allCells[index].isStar = true;
    }
    console.log(`Starring cells: ${indices}`)
}

function generateArrayGroupIndices(length) { // 4
    const list = [];
    for (let size = 1; size < length; size++) { // 1 to 3
        for (let i = 0; i <= length - size; i++) { // 0 to 3 
            const innerList = [];
            for (let s = 0; s < size; s++) { // 0 to 0
                innerList.push(i + s);
            }
            list.push(innerList);
        }
    }
    return list;
}

function generateArrayGroupSlices(indicesList) {
    const list = [];
    for (const indices of indicesList) {
        list.push([indices[0], indices[indices.length - 1] + 1])
    }
    return list;
}

// degree is the number of rows/cols checked for the pattern
// higher degree = more obsecure/difficult finds

function obviousStar() {
    if (loopSolve) return;
}

function onlyFill(degree) {
    if (loopSolve) return;
}

// TODO: MOVE RESTART TO THE OUTSIDE
function occupiedRegionsB(degree) {
    if (loopSolve) return;
    for (const [start, end] of arrayGroupSlices) {
        for (const cellsArray of [cellsByRow, cellsByCol]) {
            if (degree && (end - start !== degree)) continue;
            const cellsSection = cellsArray.slice(start, end);
            const expectedColorCount = cellsSection.length;
            const seenColors = [];
            for (const cell of cellsSection.flat()) {
                if (!seenColors.includes(cell.colorId) && !cell.isDot) seenColors.push(cell.colorId);
            }
            if (seenColors.length === expectedColorCount) {
                const sectionIndices = cellsSection.flat().map(cell => cell.index);
                const selectedCells = allCells.filter(cell =>
                    !sectionIndices.includes(cell.index) &&
                    seenColors.includes(cell.colorId) &&
                    !cell.isDot
                );
                if (selectedCells.length) {
                    console.log(`degree: ${end - start}`)
                    console.log(`a`)
                    dotCells(selectedCells.map(cell => cell.index));
                    loopSolve = true;
                    return;
                }
            }
        }
    }
}

// function solidColours(length) {
//     solidColourRow(cellsByRow, 'h', length)
//     solidColourRow(cellsByCol, 'v', length)
// }

// function solidColourRow(Matrix, orientation, length) {
//     let sameIds = []
//     let rows = []
//     for (let row in Matrix) {
//         let id = Matrix[row][0].id
//         let flag = true
//         for (let cell of Matrix[row]) {
//             if (cell.id != id) {
//                 flag = false
//                 break
//             }
//         }
//         if (flag == true) {
//             // all same within row
//             console.log("Same, row id " + row)
//             sameIds.push(id)
//             rows.push(row)
//         }
//     }
//     for (let index in sameIds) {
//         for (let cell in cellGrid) {
//             if (orientation == 'h') { // dont cancel out the row we are looking at
//                 if (Math.floor(cell / length) == rows[index]) continue
//             } else if (orientation == 'v') {
//                 if (Math.floor(cell % length) == rows[index]) continue
//             }
//             if (cellGrid[cell].id == sameIds[index]) { //place dots on cells that match the colour
//                 cellGrid[cell].isDot = true
//             }
//         }
//     }
// }