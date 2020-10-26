import {IGameActionResult, Direction, IBoard} from '../interfaces/IGame';
import GameModel from '../models/game';
import Logger from "../loaders/logger";
import {ICoordinates} from "../interfaces/ICoordinates";

const ERROR_MESSAGE = {
    INVALID_TILE_SELECTED: 'Selected tile cannot be moved',
    GAME_DOES_NOT_EXIST: 'Game does not exist',
    SOURCE_OUT_OF_BOUNDS: 'Wrong source - out of bounds',
    DESTINATION_OUT_OF_BOUNDS: 'Wrong destination - out of bounds',
    WRONG_MOVE_DIRECTION: 'Wrong move direction',
    INTERNAL_ERROR: 'Internal error',
};

const shuffleArray = (array) => {
    for (let i = 0; i < array.length - 1; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
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
        return {success: false, errorMessage: ERROR_MESSAGE.SOURCE_OUT_OF_BOUNDS};
    }

    if (destinationX < 0 || destinationX >= divider || destinationY < 0 || destinationY >= divider) {
        return {success: false, errorMessage: ERROR_MESSAGE.DESTINATION_OUT_OF_BOUNDS};
    }

    const sourceValue = board[sourceY][sourceX];
    const destinationValue = board[destinationY][destinationX];


    if ((!sourceValue && destinationValue) || (sourceValue && !destinationValue)) {
        return {success: true};
    }

    return {success: false, errorMessage: ERROR_MESSAGE.INVALID_TILE_SELECTED};
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

const replaceTiles = (source: ICoordinates, destination: ICoordinates, board: IBoard) => {
    const sourceValue = board[source.y][source.x];
    const destinationValue = board[destination.y][destination.x];

    board[source.y][source.x] = destinationValue;
    board[destination.y][destination.x] = sourceValue;
}

export default {
    async init(n: number): Promise<IGameActionResult> {
        try {
            let flatBoard = Array.apply(null, Array(n + 1)).map((val, idx) => idx + 1);
            flatBoard[flatBoard.length - 1] = undefined;
            shuffleArray(flatBoard);

            const divider = Math.sqrt(n + 1);
            let board = Array.apply(null, Array(divider)).map(_ => []);
            for (let i = 0; i < flatBoard.length; i++) {
                board[i % divider].push(flatBoard[i])
            }

            return {success: true, game: await GameModel.createNewGame(board, false)};
        } catch (error) {
            Logger.error('services/game::init error', {error});
            return {success: false, errorMessage: ERROR_MESSAGE.INTERNAL_ERROR};
        }
    },

    async play(id: string, source: ICoordinates, destination: ICoordinates): Promise<IGameActionResult> {
        try {
            let currentGame = await GameModel.getGame(id)
            if (!currentGame) {
                return {success: false, errorMessage: ERROR_MESSAGE.GAME_DOES_NOT_EXIST};
            }

            const { board } = currentGame;

            const coordinateValidation = validateCoordinates(source, destination, board);
            if (!coordinateValidation.success) {
                return coordinateValidation;
            }

            const moveDirection = getMoveDirection(source, destination);

            if (!moveDirection) {
                return {success: false, errorMessage: ERROR_MESSAGE.WRONG_MOVE_DIRECTION};
            }

            replaceTiles(source, destination, currentGame.board);

            const flatBoard = (currentGame.board as number[][]).reduce((prev, curr) => prev.concat(curr), []);

            currentGame.isFinished = !flatBoard[flatBoard.length - 1] && isArraySorted(flatBoard.filter(i => typeof i === "number"));

            return {success: true, game: currentGame};
        } catch (error) {
            Logger.error('services/game::move error', {error});
            return {success: false, errorMessage: ERROR_MESSAGE.INTERNAL_ERROR};
        }
    },
}
