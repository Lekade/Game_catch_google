import {Position} from "./position.js";

export class Game {
    #status = 'PENDING'
    #settings = {
        gridSize: {
            rowsCount: 3,
            columnsCount: 3
        },
        jumpInterval: 1000 // milliseconds
    }

    #numberUtility;
    #googlePosition;

    constructor(numberUtility) {
        this.#numberUtility = numberUtility
    }

    async setSettings(settings) {
        this.#settings = settings
    }

    async #jumpGoogle() {
        // create new position
        const newPosition = new Position(
           await this.#numberUtility
                .getRandomNumber(0, this.#settings.gridSize.columnsCount - 1),
            await this.#numberUtility
                .getRandomNumber(0, this.#settings.gridSize.rowsCount - 1)
        )

        // check new posision
        if (!!this.#googlePosition && newPosition.isEqual(this.#googlePosition)) {
            return this.#jumpGoogle();
        }

        this.#googlePosition = newPosition
    }
    async #runGoogleJumpInterval() {
        setInterval(async () => {
            await this.#jumpGoogle();
        }, this.#settings.jumpInterval)
    }

    async start() {
        this.#status = 'IN-PROGRESS'
        await this.#jumpGoogle();
        await this.#runGoogleJumpInterval();
    }

    async getStatus() {
        return this.#status
    }

    async getGooglePosition() {
        return this.#googlePosition
    }
}