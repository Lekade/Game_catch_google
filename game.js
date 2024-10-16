import {Position} from "./position.js";
import {Entity} from "./entity/Entity.js";
import {GAME_STATUSES} from "./comon/gameStatuses.js";
import {MOVE_DIRECTIONS} from "./comon/moveDirections.js";

export class Game {
    #status = GAME_STATUSES.PENDING
    #settings = {
        gridSize: {
            rowsCount: 3,
            columnsCount: 3
        },
        jumpInterval: 1000, // milliseconds
        pointsToWin: 20,
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

    constructor(numberUtility) {
        this.#numberUtility = numberUtility
        this.#gameEntities = {
            google: new Entity(),
            player1: new Entity(),
            player2: new Entity()
        }
    }

    async setSettings(settings) {
        if (settings.gridSize.rowsCount * settings.gridSize.columnsCount < 4) {
            throw new Error('Grid must have at least 4 cells')
        }
        this.#settings = settings
    }
    async #newPosition(){
        return new Position(
            await this.#numberUtility
                .getRandomNumber(0, this.#settings.gridSize.columnsCount - 1),
            await this.#numberUtility
                .getRandomNumber(0, this.#settings.gridSize.rowsCount - 1)
        )
    }

    async #jumpGoogle(iteration = 0) {
        if (iteration > 100) throw new Error(`Can't find correct cell for ${iteration}`)
        // The players must have already been placed on the playing field
        // create new position
        const newPosition = await this.#newPosition()

        // check new posision
        if ( ( !!this.#gameEntities.google.position && newPosition.isEqual(this.#gameEntities.google.position) )
            || newPosition.isEqual(this.#gameEntities.player1.position)
                || newPosition.isEqual(this.#gameEntities.player2.position)){
            return this.#jumpGoogle(++iteration);
        }

        if (!!this.#gameEntities.google.position){
            this.#gameEntities['google'].points += this.#settings.pointsForJump
            await this.#checkingForAWin('google')
        }

        this.#gameEntities.google.position = newPosition
    }

    async #initPlayersPosition() {
        // google must be jump after this initialization
        // create new position
        const newPosition1 = await this.#newPosition()
        const newPosition2 = await this.#newPosition()

        if((newPosition1).isEqual(newPosition2)){
            return this.#initPlayersPosition();
        }

        this.#gameEntities.player1.position = newPosition1
        this.#gameEntities.player2.position = newPosition2
    }

    async #runGoogleJumpInterval() {
        this.#googleJumpIntervalId = setInterval(async () => {
            await this.#jumpGoogle();
        }, this.#settings.jumpInterval)
    }

    async start() {
        console.log('start game')
        // "Принцип единого уровня абстракции" (Single Level of Abstraction Principle, SLAP).
        this.#status = GAME_STATUSES.IN_PROGRESS
        await this.#initPlayersPosition();
        await this.#jumpGoogle();
        await this.#runGoogleJumpInterval();
    }

    // getter
    async getStatus() {
        return this.#status
    }
    async getPosition(entity){
        return this.#gameEntities[entity].position
    }
    async getPoints(entity){
        return this.#gameEntities[entity].points
    }
    async getSetting(setting){
        return this.#settings[setting]
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

        if(!this.#isPositionWithinGrid(newPosition)){
            return;
        }
        if (this.#isPositionBusy(newPosition, player)){
            return;
        }
        this.#gameEntities[player].position = newPosition;
        await this.#checkGoogleCatching(newPosition, player)
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
    async #checkGoogleCatching (position, player) {
        if(this.#gameEntities.google.position.isEqual(position)){
            this.#gameEntities[player].points += this.#settings.pointsForCapture
            clearInterval(this.#googleJumpIntervalId)

            const win = await this.#checkingForAWin(player)
            if(!win){
                this.#gameEntities['google'].position = null
                await this.#jumpGoogle()
                await this.#runGoogleJumpInterval()
            }
        }
    }

    async #checkingForAWin (entity) {
        if(this.#gameEntities[entity].points >= this.#settings.pointsToWin){
            this.#status = GAME_STATUSES.FINISHED

            if (this.#googleJumpIntervalId) {
                clearInterval(this.#googleJumpIntervalId)
                this.#googleJumpIntervalId = null
            }
            return true
        }
        return  false
    }

    stop() {
        clearInterval(this.#googleJumpIntervalId)
    }
}