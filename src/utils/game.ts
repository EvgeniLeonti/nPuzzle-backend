import {Direction, IBoard} from '../interfaces/IGame';
import {ICoordinates} from "../interfaces/ICoordinates";

const initArrayOfLength = (n) => Array.apply(null, Array(n)).map((val, idx) => idx + 1);

const flatTo2DArray = (array, divider) => {
    let twoDimArray = Array.apply(null, Array(divider)).map(_ => []);
    for (let i = 0; i < array.length; i++) {
        twoDimArray[i % divider].push(array[i]);
    }
    return twoDimArray;
}

const shuffleArray = (inputArray) => {
    const array = Array.from(inputArray);
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

const isArraySorted = (array) => {
    let sorted = true;
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i+1]) {
            sorted = false;
            break;
        }
    }
    return sorted;
}

const validateCoordinates = (source: ICoordinates, destination: ICoordinates, board) => {
    const divider = board.length;

    const sourceX = source.x;
    const sourceY = source.y;
    const destinationX = destination.x;
    const destinationY = destination.y;


    if (sourceX < 0 || sourceX >= divider || sourceY < 0 || sourceY >= divider) {
        return false;
    }

    if (destinationX < 0 || destinationX >= divider || destinationY < 0 || destinationY >= divider) {
        return false;
    }

    const sourceValue = board[sourceY][sourceX];
    const destinationValue = board[destinationY][destinationX];

    return (!sourceValue && destinationValue) || (sourceValue && !destinationValue);
};

const getMoveDirection = (source: ICoordinates, destination: ICoordinates): Direction | null => {
    // UP or DOWN
    if (source.x === destination.x) {
        if (source.y === destination.y - 1) {
            return Direction.DOWN;
        }
        if (source.y === destination.y + 1) {
            return Direction.UP;
        }
    }

    // LEFT or RIGHT
    if (source.y === destination.y) {
        if (source.x === destination.x - 1) {
            return Direction.RIGHT;
        }
        if (source.x === destination.x + 1) {
            return Direction.LEFT;
        }
    }
};

const swapTiles = (source: ICoordinates, destination: ICoordinates, inputBoard: IBoard) => {
    const board = JSON.parse(JSON.stringify(inputBoard))
    const sourceValue = board[source.y][source.x];
    const destinationValue = board[destination.y][destination.x];

    board[source.y][source.x] = destinationValue;
    board[destination.y][destination.x] = sourceValue;

    return board;
}

export { initArrayOfLength, flatTo2DArray, shuffleArray, isArraySorted, validateCoordinates, getMoveDirection, swapTiles }
