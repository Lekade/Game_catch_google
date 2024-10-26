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
        this.#view.setSettingCallback = (settingName, value) => this.setSetting(settingName, value)
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
            settings: await this.#model.settings.getSettings(),
            gameEntities: {
                google: await this.#model.getEntity('google'),
                player1: await this.#model.getEntity('player1'),
                player2: await this.#model.getEntity('player2')
            },
            watch:  await this.#model.getWatch(),
            winner: await this.#model.getWinner()
        };
    }

    async setSetting(settingName, value){
        await this.#model.settings.setSetting(settingName, value)
    }

    async startGame(){
        await this.#model.lifeCycleManager.start()
    }

    async movePlayer(direction, player){
        await this.#model.playerMoveManager.movePlayer(direction, player)
    }

    async nextGame(){
        await this.#model.lifeCycleManager.nextGame()
    }

    async backToSettings(){
        await this.#model.lifeCycleManager.backToSettings()
    }

}