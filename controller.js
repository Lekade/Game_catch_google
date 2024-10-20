export class Controller {
    /**
     * @type View
     */
    #view;
    /**
     * @type Game
     */
    #model;

    // Dependency Injections
    constructor(view, model) {
        this.#view = view;
        this.#model = model;
        this.#view.startGameCallback = () => this.startGame()
        this.#view.movePlayerCallback = (direction, player) => this.movePlayer(direction, player)
        this.#view.nextGameCallback = () => this.nextGame()
        this.#view.backToSettingsCallback = () => this.backToSettings()
        this.#view.setSettingsCallback = (settings) => this.setSettings(settings)
    }

    async init() {
        this.#model.addEventListener(async () => {
            await this.#refreshUI()
        })
        await this.#refreshUI()
    }

    async #refreshUI() {
        const viewModelDTO = await this.mapModelToViewModelDTO()
        this.#view.render(viewModelDTO);
    }
    async mapModelToViewModelDTO() {
        return {
            status: await this.#model.getStatus(),
            settings: await this.#model.getSettings(),
            gameEntities: {
                google: {
                    position: await this.#model.getPosition('google'),
                    points: await this.#model.getPoints('google')
                },
                player1: {
                    position: await this.#model.getPosition('player1'),
                    points: await this.#model.getPoints('player1')
                },
                player2:  {
                    position: await this.#model.getPosition('player2'),
                    points: await this.#model.getPoints('player2')
                }
            },
            watch:  await this.#model. getWatch(),
            winner: await this.#model.getWinner()
        };
    }

    async setSettings(settings){
        await this.#model.setSettings(settings)
    }

    async startGame(settings){
        await this.#model.start(settings)
    }

    async movePlayer(direction, player){
        await this.#model.movePlayer(direction, player)
    }

    async nextGame(){
        await this.#model.nextGame()
    }

    async backToSettings(){
        await this.#model.backToSettings()
    }

}