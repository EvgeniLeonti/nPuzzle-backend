export interface IBoard {
    [index:number]: (number|null)[]
}

export interface IGame {
    id: string;
    board: IBoard;
    isFinished: boolean;
}

export interface IGameActionResult {
    success: boolean,
    errorMessage?: string
    game?: IGame
}

export enum Direction { UP = 1,DOWN ,LEFT , RIGHT}

