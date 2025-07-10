export function main(importedCellGrid, setCellGrid) {
    let cellGrid = [...importedCellGrid]; // cuz the imported one cant be edited, so u make copy
    let hori2dMatrix = [], vert2dMatrix = [];

    let length = Math.round(Math.sqrt(cellGrid.length)); //find grid size
    let clone = cellGrid.slice(); //clone array
    while(clone.length) hori2dMatrix.push(clone.splice(0,length)); //generate horizontal 2d matrix
    vert2dMatrix = hori2dMatrix[0].map((_, colIndex) => hori2dMatrix.map(row => row[colIndex])); //generate horizontal 2d matrix

    console.log(cellGrid)
    console.log("hori2dMatrix", hori2dMatrix)
    console.log("vert2dMatrix", vert2dMatrix)
    solidcolourrow(hori2dMatrix, cellGrid, 'h', length)
    solidcolourrow(vert2dMatrix, cellGrid, 'v', length)
    setCellGrid(cellGrid)

    // let sex = [...importedCellGrid]
    // sex[1].isStar = true
    // sex[8].isStar = true
    // sex[10].isStar = true
    // sex[19].isStar = true
    // sex[22].isStar = true
    // setCellGrid(sex)
    // idk u just print it first to test
    // use setCellGrid(new_grid) to change the grid or smth
}

function solidcolourrow(Matrix, cellGrid, orientation, length) {
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
                if (Math.floor(cell/length) == rows[index]) continue
            } else if (orientation == 'v') {
                if (Math.floor(cell%length) == rows[index]) continue
            }
            if(cellGrid[cell].id == sameIds[index]) { //place dots on cells that match the colour
                cellGrid[cell].isDot = true
            }
        }
    }
}