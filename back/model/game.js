import {Entity} from "./entity/entity.js";
import {GAME_STATUSES} from "../../common/gameStatuses.js";
import {Winner} from "./winner/winner.js";
import {Stopwatch} from "./stopwatch/stopwatch.js";
import {Settings} from "./settings/settings.js";
import {PlayerMoveManager} from "./playerMoveManager/playerMoveManager.js";
import {PositionManager} from "./positionManager/positionManager.js";
import {GoogleManager} from "./googleManager/googleManager.js";
import {LifeCycleManager} from "./lifeCycleManager/lifeCycleManager.js";

export class Game {
    #status = {status: GAME_STATUSES.PENDING}
    settings = new Settings(this.#status)
    numberUtility;
    #gameEntities = {
        google: {},
        player1: {},
        player2: {}
    }
    #stopwatch
    #winner = {}
    observers = []
    positionManager
    playerMoveManager
    googleManager
    lifeCycleManager

    constructor(numberUtility) {
        this.numberUtility = numberUtility
        this.#gameEntities = {
            google: new Entity(),
            player1: new Entity(),
            player2: new Entity()
        }
        this.#stopwatch = new Stopwatch()
        this.positionManager = new PositionManager(this.numberUtility)

        this.googleManager = new GoogleManager(this.#gameEntities, this.settings, this.observers, this.positionManager.newPosition.bind(this), this.#checkingForAWin.bind(this))

        this.playerMoveManager = new PlayerMoveManager(this.#gameEntities, this.settings, this.googleManager.checkGoogleCatching.bind(this.googleManager), this.observers, this.positionManager.newPosition.bind(this))

        this.lifeCycleManager = new LifeCycleManager(this.#status, this.#gameEntities, this.googleManager, this.playerMoveManager.initPlayersPosition.bind(this.playerMoveManager), this.#stopwatch.start.bind(this.#stopwatch), this.observers)
    }

    addEventListener(subscriber) {
        this.observers.push(subscriber)
    }

    /* Getting data //--------------------------------------------------------------------*/

    async getEntity(entity) {
        return this.#gameEntities[entity]
    }
    async getWinner(){
        return this.#winner
    }
    async getWatch(){
        return this.#stopwatch.seconds
    }

    async getStatus() {
        return this.#status.status
    }

    /* Process //--------------------------------------------------------------------*/

    async #checkingForAWin(entity) {
        if (this.#gameEntities[entity].points >= this.settings.pointsToWin) {
            this.#status.status = GAME_STATUSES.FINISHED

            this.#stopwatch.stop()

            if (this.googleManager.googleJumpIntervalId) {
                clearInterval(this.googleManager.googleJumpIntervalId)
                this.googleManager.googleJumpIntervalId = null
            }
            this.#winner = new Winner(entity, (await this.getEntity(entity)).points, this.#stopwatch.seconds)
            return true
        }
        return false
    }
}