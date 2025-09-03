import { areListsEqual, generateArrayGroupIndices, generateArrayGroupSlices } from "./helper/MiscHelper";
import { get3x3Around, areNumbersApartBy } from "./helper/GridDecoder";

let dpr = 1; // dots per row lmaoo i have no clue what else to call this
let allCells = [];
let sideLength;
let arrayGroupIndices = [];
// arrayGroupIndices is based off sideLength. Example:
// If the side length is 4, then arrayGroupIndices will be:
// [ [0], [1], [2], [3], [0, 1], [1, 2], [2, 3], [0, 1, 2], [1, 2, 3] ]
let arrayGroupSlices = [];
// Same thing as above, but used for the .slice(start, end) method.
let cellsByRow = [], cellsByCol = [], cellsByColor = [];

let loopSolve = true;

export function solve(importedCellGrid, setCellGrid, length) {
    allCells = [...importedCellGrid]; // cuz the imported one cant be edited, so u make copy
    sideLength = length;
    arrayGroupIndices = generateArrayGroupIndices(length);
    arrayGroupSlices = generateArrayGroupSlices(arrayGroupIndices);

    let cellGridClone = allCells.slice(); // clone array
    while (cellGridClone.length) cellsByRow.push(cellGridClone.splice(0, length));
    cellsByCol = cellsByRow[0].map((_, colIndex) => cellsByRow.map(row => row[colIndex]));
    const colorGroups = allCells.reduce((acc, cell) => {
        const { colorId } = cell;
        if (!acc[colorId]) {
            acc[colorId] = [];
        }
        acc[colorId].push(cell);
        return acc;
    }, {});
    cellsByColor = Object.values(colorGroups);

    loopSolve = true;
    while (loopSolve) {
        loopSolve = false;
        const _allCells = [...allCells];
        // solve functions
        // solidColours(length);
        obviousStar();
        DPRx2();
        occupiedRegionsB();

        // end
        if (!areListsEqual(_allCells, allCells)) loopSolve = true;
    }

    // use setCellGrid(new_grid) to change the grid or smth
}

function dotCells(indices, method) {
    for (const index of indices) {
        allCells[index].isDot = true;
    }
    console.log(`[${method}] Dotting cells: ${indices}`);
}

function starCells(indices, method) {
    for (const index of indices) {
        allCells[index].isStar = true;
        let emptyCellsToBeFilled = [];
        for (const cellsArray of [cellsByColor, cellsByRow, cellsByCol]) {
            const selectedArray = cellsArray.find(array =>
                array.some(cell => cell.index === index)
            );
            if (selectedArray.filter(cell => cell.isStar).length === dpr) { // hit the limit
                emptyCellsToBeFilled.push(...selectedArray.filter(cell => !cell.isDot && !cell.isStar).map(cell => cell.index));
            }
        }
        emptyCellsToBeFilled.push(
            ...get3x3Around(index, sideLength)
                .map(index => allCells[index])
                .filter(cell => !cell.isDot && !cell.isStar)
                .map(cell => cell.index)
        );
        emptyCellsToBeFilled = [...new Set(emptyCellsToBeFilled)];
        if (emptyCellsToBeFilled.length) {
            dotCells(emptyCellsToBeFilled, `Star in Cell ${index}`);
        }
    }
    console.log(`[${method}] Starring cells: ${indices}`);
}

// degree is the number of rows/cols checked for the pattern
// higher degree = more obsecure/difficult finds

function obviousStar() {
    if (loopSolve) return;
    for (const cellsArray of [cellsByColor, cellsByRow, cellsByCol]) {
        for (const array of cellsArray) {
            const emptyCells = array.filter(cell => !cell.isDot && !cell.isStar);
            if (emptyCells.length != 1) continue;
            starCells([emptyCells[0].index], "obviousStar");
            loopSolve = true;
            return;
        }
    }
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
                    dotCells(selectedCells.map(cell => cell.index), "occupiedRegionsB");
                    loopSolve = true;
                    return;
                }
            }
        }
    }
}

function DPRx2() { // if a row has 2x the DPR in remaining cells, and they are consecutive, the cells parallel to them are dots
    if (loopSolve) return;
    for (const orientation of ['h', 'v']) {
        const Matrix = orientation === 'h' ? cellsByRow : cellsByCol;
        let rows = []
        let cells = []
        for (let row in Matrix) {
            let cells = Matrix[row].filter(obj => !obj.isDot && !obj.isStar);
            if (cells.length != dpr * 2) continue;
            if (!(
                areNumbersApartBy(cells.map(cell => cell.index), 1) ||
                areNumbersApartBy(cells.map(cell => cell.index), sideLength)
            )) continue;
            rows.push(row);
            for (let cell of Matrix[row]) {
                let index = allCells.indexOf(cell);
                cells.push(index);
            }
        }
        const dotCellsList = [];
        for (let cell of cells) {
            if (orientation === 'h') {
                if (cell >= sideLength) {
                    let aboveCellIndex = cell - sideLength;
                    if (!allCells[aboveCellIndex].isDot && !allCells[aboveCellIndex].isStar) dotCellsList.push(aboveCellIndex);
                }
                if (cell < allCells.length - sideLength) {
                    let belowCellIndex = cell + sideLength;
                    if (!allCells[belowCellIndex].isDot && !allCells[belowCellIndex].isStar) dotCellsList.push(belowCellIndex);
                }
            } else { // 'v'
                if (cell % sideLength !== 0) {
                    let leftCellIndex = cell - 1;
                    if (!allCells[leftCellIndex].isDot && !allCells[leftCellIndex].isStar) dotCellsList.push(leftCellIndex);
                }
                if (cell % sideLength !== sideLength - 1) {
                    let rightCellIndex = cell + 1;
                    if (!allCells[rightCellIndex].isDot && !allCells[rightCellIndex].isStar) dotCellsList.push(rightCellIndex);
                }
            }
        }
        if (dotCellsList.length) {
            dotCells(dotCellsList, "DPRx2");
            loopSolve = true;
            return;
        }
        // loopSolve = true;
        // return;
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
//         for (let cell in allCells) {
//             if (orientation == 'h') { // dont cancel out the row we are looking at
//                 if (Math.floor(cell / length) == rows[index]) continue
//             } else if (orientation == 'v') {
//                 if (Math.floor(cell % length) == rows[index]) continue
//             }
//             if (allCells[cell].id == sameIds[index]) { //place dots on cells that match the colour
//                 allCells[cell].isDot = true
//             }
//         }
//     }
// }