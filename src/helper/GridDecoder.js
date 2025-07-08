export function index_to_column(index, side_length) {
    return index % side_length;
}

export function index_to_row(index, side_length) {
    return Math.floor(index / side_length);
}