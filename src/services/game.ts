import {IBoard, IGame, IGameActionResult} from '../interfaces/IGame';
import GameModel from '../models/game';
import Logger from "../loaders/logger";
import {ICoordinates} from "../interfaces/ICoordinates";
import {createNewBoard, isBoardSolved, swapBoardTiles} from "../utils/gameBoard";
import {isValidCoordinates, isValidMoveDirection} from "../validators/gameMove";

const ERROR_MESSAGE = {
    INVALID_TILE_SELECTED: 'Selected tile cannot be moved',
    GAME_DOES_NOT_EXIST: 'Game does not exist',
    SOURCE_OUT_OF_BOUNDS: 'Wrong source - out of bounds',
    DESTINATION_OUT_OF_BOUNDS: 'Wrong destination - out of bounds',
    WRONG_MOVE_DIRECTION: 'Wrong move direction',
    INTERNAL_ERROR: 'Internal error',
};

export default {
    async init(n: number): Promise<IGameActionResult> {
        try {
            const board: IBoard = createNewBoard(n);
            const game: IGame = await GameModel.createNewGame(board, false);

            Logger.info('services/game init: new game created', {game});

            return {success: true, game};
        } catch (error) {
            Logger.error('services/game init: error', error);
            return {success: false, errorMessage: ERROR_MESSAGE.INTERNAL_ERROR};
        }
    },

    async play(id: string, source: ICoordinates, destination: ICoordinates): Promise<IGameActionResult> {
        try {
            const currentGame = await GameModel.getGame(id)
            if (!currentGame) {
                Logger.warn('services/game play: ' + ERROR_MESSAGE.GAME_DOES_NOT_EXIST);
                return {success: false, errorMessage: ERROR_MESSAGE.GAME_DOES_NOT_EXIST};
            }

            const {board} = currentGame;

            if (!isValidCoordinates(source, destination, board)) {
                Logger.warn('services/game play: ' + ERROR_MESSAGE.INVALID_TILE_SELECTED);
                return {success: false, errorMessage: ERROR_MESSAGE.INVALID_TILE_SELECTED};
            }

            if (!isValidMoveDirection(source, destination)) {
                Logger.warn('services/game play: ' + ERROR_MESSAGE.WRONG_MOVE_DIRECTION)
                return {success: false, errorMessage: ERROR_MESSAGE.WRONG_MOVE_DIRECTION};
            }

            Logger.info('services/game play: current board', {board});
            const updatedBoard = swapBoardTiles(source, destination, board);
            Logger.info('services/game play: new board', {newBoard: updatedBoard});

            const isFinished = isBoardSolved(updatedBoard);

            const gameFromDB = await GameModel.updateGame(id, updatedBoard, isFinished);

            Logger.info('services/game init: game updated', {gameFromDB});

            return {success: true, game: gameFromDB};
        } catch (error) {
            Logger.error('services/game move: error', error);
            return {success: false, errorMessage: ERROR_MESSAGE.INTERNAL_ERROR};
        }
    },
}
