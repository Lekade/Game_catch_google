export class NetworkController {
    /**
     * @type View
     */
    #view;
    /**
     * @type APIProxy
     */
    #apiProxy;

    // Dependency Injections
    constructor(view, APIProxy) {
        this.#view = view;
        this.#apiProxy = APIProxy;
        this.#view.startGameCallback = () => this.startGame()
        this.#view.movePlayerCallback = (direction, player) => this.movePlayer(direction, player)
        this.#view.nextGameCallback = () => this.nextGame()
        this.#view.backToSettingsCallback = () => this.backToSettings()
        this.#view.setSettingCallback = (settingName, value) => this.setSetting(settingName, value)
    }

    async init() {
        this.#apiProxy.addEventListener(async (viewModelDTO)=>{
            await this.#refreshUI(viewModelDTO)
        })
    }

    async #refreshUI(viewModelDTO) {
        this.#view.render(viewModelDTO);
    }

    async setSetting(settingName, value){
        await this.#apiProxy.setSetting(settingName, value)
    }

    async startGame(){
        await this.#apiProxy.startGame()
    }

    async movePlayer(direction, player){
        await this.#apiProxy.movePlayer(direction, player)
    }

    async nextGame(){
        await this.#apiProxy.nextGame()
    }

    async backToSettings(){
        await this.#apiProxy.backToSettings()
    }

}