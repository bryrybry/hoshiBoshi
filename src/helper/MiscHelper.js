export function areListsEqual(list1, list2) {
    function deepEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    if (list1.length !== list2.length) return false;
    return list1.every((item, index) => deepEqual(item, list2[index]));
}

export function generateArrayGroupIndices(length) { // 4
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

export function generateArrayGroupSlices(indicesList) {
    const list = [];
    for (const indices of indicesList) {
        list.push([indices[0], indices[indices.length - 1] + 1])
    }
    return list;
}