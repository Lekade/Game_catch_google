import {GAME_STATUSES} from "../../../common/gameStatuses.js";

export class LifeCycleManager{
    #status
    #gameEntities
    googleManager
    initPlayersPosition
    stopwatchStart
    observers

    constructor(status, gameEntities, googleManager, initPlayersPosition, stopwatchStart, observers) {
        this.#status = status
        this.#gameEntities = gameEntities
        this.googleManager = googleManager
        this.initPlayersPosition = initPlayersPosition
        this.stopwatchStart = stopwatchStart
        this.observers = observers
    }


    async start() {
        this.#status.status = GAME_STATUSES.IN_PROGRESS
        await this.initPlayersPosition();
        await this.googleManager.jumpGoogle();
        await this.stopwatchStart()
        await this.googleManager.runGoogleJumpInterval();
    }

    stop() {
        clearInterval(this.googleManager.googleJumpIntervalId)
    }

    async #reset(){
        this.#gameEntities.google.reset()
        this.#gameEntities.player1.reset()
        this.#gameEntities.player2.reset()
    }

    async nextGame(){
        await this.#reset()
        await this.start()
    }

    async backToSettings(){
        await this.#reset()
        this.#status.status = GAME_STATUSES.PENDING
        this.observers.forEach(o => o())
    }
}