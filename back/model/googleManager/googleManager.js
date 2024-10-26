export class GoogleManager{
    #gameEntities
    #settings
    observers
    googleJumpIntervalId = null;
    newPosition
    #checkingForAWin

    constructor(gameEntities, settings, observer, newPosition, checkingForAWin) {
        this.#gameEntities = gameEntities
        this.#settings = settings
        this.observers = observer
        this.newPosition = newPosition
        this.#checkingForAWin = checkingForAWin
    }
    async jumpGoogle() {
        // The players must have already been placed on the playing field
        const newPosition = await this.newPosition(this.#settings.gridSize)

        // check new posision
        if ((!!this.#gameEntities.google.position && newPosition.isEqual(this.#gameEntities.google.position))
            || newPosition.isEqual(this.#gameEntities.player1.position)
            || newPosition.isEqual(this.#gameEntities.player2.position)){
            return this.jumpGoogle();
        }

        if (!!this.#gameEntities.google.position) {
            this.#gameEntities['google'].points += this.#settings.pointsForJump
            await this.#checkingForAWin('google')
        }
        this.#gameEntities.google.position = newPosition
        this.observers.forEach(o => o())
    }

    async runGoogleJumpInterval() {
        this.googleJumpIntervalId = setInterval(async () => {
            await this.jumpGoogle();
        }, this.#settings.jumpInterval)
    }

    async checkGoogleCatching(position, player) {
        if (this.#gameEntities.google.position.isEqual(position)) {
            this.#gameEntities[player].points += this.#settings.pointsForCapture
            clearInterval(this.googleJumpIntervalId)

            const win = await this.#checkingForAWin(player)
            if (!win) {
                this.#gameEntities['google'].position = null
                await this.jumpGoogle()
                await this.runGoogleJumpInterval()
            }
        }
    }
}