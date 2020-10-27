import {isValidCoordinates} from "../interfaces/ICoordinates";

const WRONG_PARAMS_MESSAGE = {
    N_SHOULD_BE_INT: 'n should be an integer',
    WRONG_OR_MISSING_ID: 'wrong or missing id',
    WRONG_SOURCE_OR_DESTINATION: 'wrong source or destination'
};

export default {
    init: (inputObject) => {
        const {n} = inputObject;
        if (typeof n !== "number") {
            return {success: false, errorMessage: WRONG_PARAMS_MESSAGE.N_SHOULD_BE_INT};
        }
        return {success: true};
    },
    play: (inputObject) => {
        const {id, source, destination} = inputObject;
        if (typeof id !== "string") {
            return {success: false, errorMessage: WRONG_PARAMS_MESSAGE.WRONG_OR_MISSING_ID};
        }
        if (!isValidCoordinates(source) || !isValidCoordinates(destination)) {
            return {success: false, errorMessage: WRONG_PARAMS_MESSAGE.WRONG_SOURCE_OR_DESTINATION};
        }
        return {success: true};
    }
}