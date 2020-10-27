export interface ICoordinates {
    x: number;
    y: number;
}

export function isValidCoordinates(input) {
    if (typeof input !== "object" || Object.values(input).length !== 2 || typeof input.x !== "number" || typeof input.y !== "number") {
        return false;
    }

    return true;
}