import {Position} from "./position.js";

export class PositionManager{
    numberUtility
    constructor( numberUtility) {
        this.numberUtility = numberUtility
    }
    async newPosition(gridSize) {
        return new Position(
            await this.numberUtility.getRandomNumber(0, gridSize.columnsCount - 1),
            await this.numberUtility.getRandomNumber(0, gridSize.rowsCount - 1)
        )
    }
}