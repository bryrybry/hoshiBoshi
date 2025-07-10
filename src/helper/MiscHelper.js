export function areListsEqual(list1, list2) {
    function deepEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    if (list1.length !== list2.length) return false;
    return list1.every((item, index) => deepEqual(item, list2[index]));
}