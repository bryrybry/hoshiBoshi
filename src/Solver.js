import { areListsEqual } from "./helper/MiscHelper";

export function solve(importedCellGrid, setCellGrid, length) {
    let cellGrid = [...importedCellGrid]; // cuz the imported one cant be edited, so u make copy
    let hori2dMatrix = [], vert2dMatrix = [];

    let clone = cellGrid.slice(); //clone array
    while (clone.length) hori2dMatrix.push(clone.splice(0, length)); //generate horizontal 2d matrix
    vert2dMatrix = hori2dMatrix[0].map((_, colIndex) => hori2dMatrix.map(row => row[colIndex])); //generate horizontal 2d matrix

    while (true) {
        const oldCellGrid = [...cellGrid];
        // solve functions
        solidColours(hori2dMatrix, vert2dMatrix, cellGrid, length);
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
function solidColourRow(Matrix, cellGrid, orientation, length) {
    let sameIds = []
    let rows = []
    for (let row in Matrix) {
        let id = Matrix[row][0].id
        let flag = true
        for (let cell of Matrix[row]) {
            if (cell.id != id) {
                flag = false
                break
            }
        }
        if (flag == true) {
            // all same within row
            console.log("Same, row id " + row)
            sameIds.push(id)
            rows.push(row)
        }
    }
    for (let index in sameIds) {
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