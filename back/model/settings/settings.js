import {GAME_STATUSES} from "../../../common/gameStatuses.js";

export class Settings {
    #status
    gridSize = {
        rowsCount: 5,
        columnsCount: 5
    }
    jumpInterval = 1000 // milliseconds
    pointsToWin = 40
    pointsForJump = 2
    pointsForCapture = 5

    constructor(status) {
        this.#status = status
    }

    async setSetting(settingName, value) {
        if (settingName === 'gridSize' && value.rowsCount * value.columnsCount < 4) {
            throw new Error('Grid must have at least 4 cells')
        }
        if(this.#status.status === GAME_STATUSES.PENDING){
            this[settingName] = value
        }
    }

    async getSettings() {
        return {
            gridSize: this.gridSize,
            jumpInterval: this.jumpInterval,
            pointsToWin: this.pointsToWin,
            pointsForJump: this.pointsForJump,
            pointsForCapture: this.pointsForCapture,
        }
    }
}