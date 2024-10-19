import {Position} from "./position.js";
import {Entity} from "./entity/Entity.js";
import {GAME_STATUSES} from "../common/gameStatuses.js";
import {MOVE_DIRECTIONS} from "../common/moveDirections.js";
import {Winner} from "./winner/Winner.js";
import {Stopwatch} from "./stopwatch/Stopwatch.js";

export class Game {
    #status = GAME_STATUSES.PENDING
    #settings = {
        gridSize: {
            rowsCount: 5,
            columnsCount: 5
        },
        jumpInterval: 1000, // milliseconds
        pointsToWin: 40,
        pointsForJump: 2,
        pointsForCapture: 5
    }
    #googleJumpIntervalId = null;
    #numberUtility;
    #gameEntities = {
        google: {},
        player1: {},
        player2: {}
    }
    #stopwatch
    #winner = {}
    #observers = []

    addEventListener(subscriber) {
        this.#observers.push(subscriber)
    }

    constructor(numberUtility) {
        this.#numberUtility = numberUtility
        this.#gameEntities = {
            google: new Entity(),
            player1: new Entity(),
            player2: new Entity()
        }
        this.#stopwatch = new Stopwatch()
    }

    async setSettings(settings) {
        if (settings.gridSize.rowsCount * settings.gridSize.columnsCount < 4) {
            throw new Error('Grid must have at least 4 cells')
        }
        this.#settings = settings
    }

    async #newPosition() {
        return new Position(
            await this.#numberUtility
                .getRandomNumber(0, this.#settings.gridSize.columnsCount - 1),
            await this.#numberUtility
                .getRandomNumber(0, this.#settings.gridSize.rowsCount - 1)
        )
    }

    async #jumpGoogle() {
        // The players must have already been placed on the playing field
        const newPosition = await this.#newPosition()

        // check new posision
        if ((!!this.#gameEntities.google.position && newPosition.isEqual(this.#gameEntities.google.position))
            || newPosition.isEqual(this.#gameEntities.player1.position)
            || newPosition.isEqual(this.#gameEntities.player2.position)){
            return this.#jumpGoogle();
        }

        if (!!this.#gameEntities.google.position) {
            this.#gameEntities['google'].points += this.#settings.pointsForJump
            await this.#checkingForAWin('google')
        }
        this.#gameEntities.google.position = newPosition
        this.#observers.forEach(o => o())
    }

    async #initPlayersPosition() {
        // google must be jump after this initialization
        const newPosition1 = await this.#newPosition()
        const newPosition2 = await this.#newPosition()

        if ((newPosition1).isEqual(newPosition2)) {
            return this.#initPlayersPosition();
        }

        this.#gameEntities.player1.position = newPosition1
        this.#gameEntities.player2.position = newPosition2
        this.#observers.forEach(o => o())
    }

    async #runGoogleJumpInterval() {
        this.#googleJumpIntervalId = setInterval(async () => {
            await this.#jumpGoogle();
        }, this.#settings.jumpInterval)
    }

    async start(settings) {
        console.log('start game')
        if (settings) {await this.setSettings(settings)}
        this.#status = GAME_STATUSES.IN_PROGRESS
        await this.#initPlayersPosition();
        await this.#jumpGoogle();
        await this.#stopwatch.start()
        await this.#runGoogleJumpInterval();
    }

    // getter
    async getStatus() {
        return this.#status
    }

    async getPosition(entity) {
        return this.#gameEntities[entity].position
    }

    async getPoints(entity) {
        return this.#gameEntities[entity].points
    }

    async getSettings() {
        return this.#settings
    }
    async getWinner(){
        return this.#winner
    }
    async getWatch(){
        return this.#stopwatch.seconds
    }

    async movePlayer(direction, player) {

        const delta = {
            x: 0, y: 0
        }

        switch (direction) {
            case MOVE_DIRECTIONS.UP:
                delta.y = -1
                break
            case MOVE_DIRECTIONS.DOWN:
                delta.y = 1
                break
            case MOVE_DIRECTIONS.LEFT:
                delta.x = -1
                break
            case MOVE_DIRECTIONS.RIGHT:
                delta.x = 1
                break
            default:
                throw new Error('Invalid direction')
        }
        let newPosition;

        try {
            newPosition = new Position(
                this.#gameEntities[player].position.x + delta.x,
                this.#gameEntities[player].position.y + delta.y
            )
        } catch (e) {
            return
        }

        if (!this.#isPositionWithinGrid(newPosition)) {
            return;
        }
        if (this.#isPositionBusy(newPosition, player)) {
            return;
        }
        this.#gameEntities[player].position = newPosition;
        await this.#checkGoogleCatching(newPosition, player)
        this.#observers.forEach(o => o())
    }

    #isPositionWithinGrid(position) {
        return (
            position.x >= 0 && position.x < this.#settings.gridSize.columnsCount
            && position.y >= 0 && position.y < this.#settings.gridSize.rowsCount
        )
    }

    #isPositionBusy(position, player) {
        return position.isEqual(this.#gameEntities[player].position)
    }

    async #checkGoogleCatching(position, player) {
        if (this.#gameEntities.google.position.isEqual(position)) {
            this.#gameEntities[player].points += this.#settings.pointsForCapture
            clearInterval(this.#googleJumpIntervalId)

            const win = await this.#checkingForAWin(player)
            if (!win) {
                this.#gameEntities['google'].position = null
                await this.#jumpGoogle()
                await this.#runGoogleJumpInterval()
            }
        }
    }

    async #checkingForAWin(entity) {
        if (this.#gameEntities[entity].points >= this.#settings.pointsToWin) {
            this.#status = GAME_STATUSES.FINISHED

            this.#stopwatch.stop()

            if (this.#googleJumpIntervalId) {
                clearInterval(this.#googleJumpIntervalId)
                this.#googleJumpIntervalId = null
            }
            this.#winner = new Winner(entity, await this.getPoints(entity), this.#stopwatch.seconds)
            return true
        }
        return false
    }

    stop() {
        clearInterval(this.#googleJumpIntervalId)
    }
}