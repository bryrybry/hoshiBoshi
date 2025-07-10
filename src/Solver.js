import { FaLink } from "react-icons/fa";
import { areListsEqual } from "./helper/MiscHelper";
import { ImKey } from "react-icons/im";

export function solve(importedCellGrid, setCellGrid, length) {
    let cellGrid = [...importedCellGrid]; // cuz the imported one cant be edited, so u make copy
    let hori2dMatrix = [], vert2dMatrix = [];

    let clone = cellGrid.slice(); //clone array
    while (clone.length) hori2dMatrix.push(clone.splice(0, length)); //generate horizontal 2d matrix
    vert2dMatrix = hori2dMatrix[0].map((_, colIndex) => hori2dMatrix.map(row => row[colIndex])); //generate horizontal 2d matrix

    let dpr = 1; // dots per row lmaoo i have no clue what else to call this

    while (true) {
        const oldCellGrid = [...cellGrid];
        // solve functions
        // cellGrid[24].isDot = true;
        solidColours(hori2dMatrix, vert2dMatrix, cellGrid, length);
        DPRx2(hori2dMatrix, vert2dMatrix, cellGrid, length, dpr)
        // end
        setCellGrid(cellGrid);
        if (areListsEqual(oldCellGrid, cellGrid)) break;
    }
    
    // use setCellGrid(new_grid) to change the grid or smth
}

function solidColours(hori2dMatrix, vert2dMatrix, cellGrid, length) {
    solidColourRow(hori2dMatrix, cellGrid, 'h', length)
    solidColourRow(vert2dMatrix, cellGrid, 'v', length)
}

function DPRx2(hori2dMatrix, vert2dMatrix, cellGrid, length, dpr) {
    DPRx2Row(hori2dMatrix, cellGrid, 'h', length, dpr)
    DPRx2Row(vert2dMatrix, cellGrid, 'v', length, dpr)
}

function solidColourRow(Matrix, cellGrid, orientation, length) { // if a row's cells all same colour, other cells with the same colour not within that row are dots
    // console.log("solidColourRow in " + orientation + " mode")
    let sameIds = []
    let rows = []
    for (let row in Matrix) {
        let id = -1
        let flag = true
        for (let cell of Matrix[row]) {
            if (cell.isDot == false && id == -1) { // set row's colour to match
                id = cell.id
            }
            if (cell.id != id && cell.isDot == false) { // check if cell colour matches row 
                flag = false
                break
            }
        }
        if (flag == true) {
            // all same within row
            // console.log("Same, row id " + orientation + row)
            sameIds.push(id)
            rows.push(row)
        }
    }

    for (let index in sameIds) { // placing the dots
        for (let cell in cellGrid) {
            if (orientation == 'h') { // dont cancel out the row we are looking at
                if (Math.floor(cell / length) == rows[index]) continue
            } else if (orientation == 'v') {
                if (Math.floor(cell % length) == rows[index]) continue
            }
            if (cellGrid[cell].id == sameIds[index]) { //place dots on cells that match the colour
                cellGrid[cell].isDot = true
            }
        }
    }
}

function DPRx2Row(Matrix, cellGrid, orientation, length, dpr) { // if a row has 2x the DPR in remaining cells, and they are consecutive, the cells parallel to them are dots
    // console.log("DPRx2 in " + orientation + " mode")
    let rows = []
    let cells = []
    for (let row in Matrix) {
        let cellCount = Matrix[row].filter(obj => obj.isDot === false).length
        if (cellCount != dpr * 2) continue
        console.log("2xdpr row found at " + orientation + row)
        rows.push(row)
        for (let cell of Matrix[row]) {
            if (cell.isDot === true) continue
            let index = cellGrid.indexOf(cell)
            cells.push(index)
        }
    }
    console.log(cells)
    if (orientation == 'h'){
        for (let cell of cells) {
            if (cell > length) {let aboveCellIndex = cell - 5; cellGrid[aboveCellIndex].isDot = true}
            if (cell < cellGrid.length - length) {let belowCellIndex = cell + 5; cellGrid[belowCellIndex].isDot = true}
        }
    }

}