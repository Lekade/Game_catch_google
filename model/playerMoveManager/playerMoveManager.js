import {MOVE_DIRECTIONS} from "../../common/moveDirections.js";
import {Position} from "../positionManager/position.js";

export class PlayerMoveManager {
    #gameEntities
    #settings
    observers
    checkGoogleCatching
    newPosition

    constructor(gameEntities, settings, checkGoogleCatching, observer, newPosition) {
        this.#gameEntities = gameEntities
        this.#settings = settings
        this.checkGoogleCatching = checkGoogleCatching
        this.observers = observer
        this.newPosition = newPosition
    }

    async initPlayersPosition() {
        // google must be jump after this initialization
        const newPosition1 = await this.newPosition(this.#settings.gridSize)
        const newPosition2 = await this.newPosition(this.#settings.gridSize)

        if ((newPosition1).isEqual(newPosition2)) {
            return this.initPlayersPosition();
        }

        this.#gameEntities.player1.position = newPosition1
        this.#gameEntities.player2.position = newPosition2
        this.observers.forEach(o => o())
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
        await this.checkGoogleCatching(newPosition, player)
        this.observers.forEach(o => {
            return o()
        })
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
}