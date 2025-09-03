export function index_to_column(index, side_length) {
    return index % side_length;
}

export function index_to_row(index, side_length) {
    return Math.floor(index / side_length);
}

export function get3x3Around(index, sideLength) {
    const row = Math.floor(index / sideLength);
    const col = index % sideLength;
    const result = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;

            // skip if out of bounds
            if (r >= 0 && r < sideLength && c >= 0 && c < sideLength) {
                result.push(r * sideLength + c);
            }
        }
    }
    return result;
}

export function areNumbersApartBy(listOfNumbers, difference) {
  if (listOfNumbers.length < 2) return true; // trivially true for 0 or 1 element

  for (let i = 1; i < listOfNumbers.length; i++) {
    if (listOfNumbers[i] - listOfNumbers[i - 1] !== difference) {
      return false;
    }
  }
  return true;
}