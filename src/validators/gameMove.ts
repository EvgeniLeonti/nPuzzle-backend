import {ICoordinates} from "../interfaces/ICoordinates";
import {IBoard} from "../interfaces/IGame";
import {getMoveDirection} from "../utils/gameBoard";


const _isCoordinatesOutOfBound = (source: ICoordinates, destination: ICoordinates, board: IBoard): boolean => {
    const divider = (board as number[][]).length;

    if (source.x < 0 || source.x >= divider || source.y < 0 || source.y >= divider) {
        return true;
    }

    if (destination.x < 0 || destination.x >= divider || destination.y < 0 || destination.y >= divider) {
        return true;
    }
};

const _isValidSourceNDestinationValues = (source: ICoordinates, destination: ICoordinates, board: IBoard): boolean => {
    const sourceValue = board[source.y][source.x];
    const destinationValue = board[destination.y][destination.x];

    return !!(!sourceValue && destinationValue) || (sourceValue && !destinationValue);
}

/**
 * make sure that:
 * 1. source and destination are within board limits
 * 2. only one of source or destination should be undefined (mutually exclusive)
 * 
 * @param source
 * @param destination
 * @param board
 */
const isValidCoordinates = (source: ICoordinates, destination: ICoordinates, board: IBoard): boolean =>
    !_isCoordinatesOutOfBound(source, destination, board) && _isValidSourceNDestinationValues(source, destination, board);

/**
 * make sure that move is legal (UP, DOWN, RIGHT or LEFT)
 *
 * @param source
 * @param destination
 */
const isValidMoveDirection = (source: ICoordinates, destination: ICoordinates): boolean =>
    !!getMoveDirection(source, destination);

export { isValidCoordinates, isValidMoveDirection };