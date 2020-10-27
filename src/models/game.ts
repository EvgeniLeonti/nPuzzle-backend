/*
    this is a pseudo db wrapper:
    can be used in the future to write/read mysql db (with serialization of board to string, for example) or noSQL (without any serialization)
 */

import { v4 as uuid } from 'uuid';
import {IBoard, IGame} from "../interfaces/IGame";

const games = {};

export default {
    createNewGame: async (board, isFinished: boolean): Promise<IGame> => {
        const id = uuid();
        const game = {id, board, isFinished};

        games[id] = game;

        return game;
    },
    getGame: async (id): Promise<IGame> => {
        return games[id];
    },
    updateGame: async (id, board: IBoard, isFinished: boolean): Promise<IGame> => {
        const existingGame = games[id];
        if (!existingGame) {
            return;
        }
        let newGame = JSON.parse(JSON.stringify(existingGame));
        newGame.board = board;
        newGame.isFinished = isFinished;

        games[id] = newGame;

        return games[id];
    }
}