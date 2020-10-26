import { v4 as uuid } from 'uuid';
import {IGame} from "../interfaces/IGame";

// todo make it as db

const games = {};

export default {
    createNewGame: async (board, isFinished): Promise<IGame> => {
        const id = uuid();
        const game = {id, board, isFinished};

        games[id] = game;

        return game;
    },
    getGame: async (id): Promise<IGame> => {
        return games[id];
    }
}