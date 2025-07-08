export function main(importedCellGrid, setCellGrid) {
    let cellGrid = [...importedCellGrid]; // cuz the imported one cant be edited, so u make copy
    let hori2dMatrix = [], vert2dMatrix = [];

    let length = Math.round(Math.sqrt(cellGrid.length)); //find grid size
    let clone = cellGrid.slice(); //clone array
    while(clone.length) hori2dMatrix.push(clone.splice(0,length)); //generate horizontal 2d matrix
    vert2dMatrix = hori2dMatrix[0].map((_, colIndex) => hori2dMatrix.map(row => row[colIndex])); //generate horizontal 2d matrix

    console.log(cellGrid);
    console.log("hori2dMatrix", hori2dMatrix);
    console.log("vert2dMatrix", vert2dMatrix);
    // console.log(setCellGrid);
    solidcolourrow(hori2dMatrix)

    let sex = [...importedCellGrid];
    sex[1].isStar = true;
    sex[8].isStar = true;
    sex[10].isStar = true;
    sex[19].isStar = true;
    sex[22].isStar = true;
    setCellGrid(sex);
    // idk u just print it first to test
    // use setCellGrid(new_grid) to change the grid or smth
}

function solidcolourrow(Matrix) {
    for (let row in Matrix) {
        let id = Matrix[row][0].id;
        let flag = true;
        for (let cell of Matrix[row]) {
            if (cell.id != id) {
                // not same
                console.log("not same");
                flag = false;
                break;
            }
        }
        if (flag == true) {
        // all same within row
        console.log("Same, row id " + row);
        // all others with this cell id has to be dots. (TODO)
        }
    }
}