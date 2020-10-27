import {Direction, IBoard} from '../interfaces/IGame';
import {ICoordinates} from "../interfaces/ICoordinates";

const _initFlatSortedBoard = (n) => Array.apply(null, Array(n)).map((val, idx) => idx + 1);

const _shuffleFlatBoard = (inputArray) => {
    const array = Array.from(inputArray);
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

const _flatToBoard = (array, divider) => {
    let twoDimArray = Array.apply(null, Array(divider)).map(_ => []);
    for (let i = 0; i < array.length; i++) {
        twoDimArray[i % divider].push(array[i]);
    }
    return twoDimArray;
};

const _boardToFlat = (board: IBoard) => (board as number[][]).reduce((prev, curr) => prev.concat(curr), []);

const _isFlatBoardSorted = (array) => {
    let sorted = true;
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i+1]) {
            sorted = false;
            break;
        }
    }
    return sorted;
}

/**
 * replaces values of source and destination tiles. this is essentially does the 'play' of the game
 *
 * @param source
 * @param destination
 * @param inputBoard
 */
const swapBoardTiles = (source: ICoordinates, destination: ICoordinates, inputBoard: IBoard): IBoard => {
    const board = JSON.parse(JSON.stringify(inputBoard))
    const sourceValue = board[source.y][source.x];
    const destinationValue = board[destination.y][destination.x];

    board[source.y][source.x] = destinationValue;
    board[destination.y][destination.x] = sourceValue;

    return board;
}

/**
 * for a given source and destination, return the move direction (if valid)
 *
 * @param source
 * @param destination
 */
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

/**
 * for a given n, create a new board
 *
 * @param n
 */
const createNewBoard = (n: number): IBoard => {
    const flat = _initFlatSortedBoard(n + 1);
    flat[flat.length - 1] = undefined;

    const flatShuffled = _shuffleFlatBoard(flat);

    return _flatToBoard(flatShuffled, Math.sqrt(n + 1))
}

/**
 * for a given board, check if it is solved
 *
 * @param board
 */
const isBoardSolved = (board: IBoard): boolean => {
    const flatBoard = _boardToFlat(board);
    return !flatBoard[flatBoard.length - 1] && _isFlatBoardSorted(flatBoard.filter(i => typeof i === "number"));

}

export { createNewBoard, isBoardSolved, swapBoardTiles, getMoveDirection }
