import {GAME_STATUSES} from "../common/gameStatuses.js";
import {clockShaper} from "./clockShaper/clockShaper.js";
import {SettingsCreator} from "./settingsCreator/settingsCreator.js";
import {GameResultsCreator} from "./gameResultsCreator/gameResultsCreator.js";
import {GridBuilderCreator} from "./gridBuilderCreator/gridBuilderCreator.js";
import {ResultModalCreator} from "./resultModalCreator/resultModalCreator.js";
import {KeyHandler} from "./keyHandler/keyHandler.js";

export class View {
    #rootElement;
    #setSettingHandler
    #startGameHandler
    #movePlayerHandler
    #clockShaper
    #nextGameHandler
    #backToSettingsHandler
    settingsCreator
    gameResultsCreator
    gridBuilderCreator
    resultModalCreator
    keyHandler

    constructor(elementId) {
        this.#clockShaper = new  clockShaper()
        this.#rootElement = document.getElementById(elementId)

        this.settingsCreator = new SettingsCreator(this.#rootElement, (settingName, value) => this.#setSettingHandler(settingName, value), () => this.#startGameHandler())

        this.gameResultsCreator = new GameResultsCreator(this.#rootElement)

        this.gridBuilderCreator = new GridBuilderCreator()

        this.resultModalCreator = new ResultModalCreator(this.#rootElement, this.#clockShaper, () => this.#nextGameHandler(), () => this.#backToSettingsHandler())

        this.keyHandler = new KeyHandler((direction, player) => this.#movePlayerHandler(direction, player))
    }

    set setSettingCallback(callback){
        this.#setSettingHandler = (settingName, value) =>  callback(settingName, value)
    }

    set startGameCallback(callback) {
        this.#startGameHandler = callback
    }

    set movePlayerCallback(callback) {
        this.#movePlayerHandler = (direction, player) => callback(direction, player)
    }

    set nextGameCallback (callback){
        this.#nextGameHandler = callback
    }

    set backToSettingsCallback (callback){
        this.#backToSettingsHandler = callback
    }

    render(viewModelDTO) {
        this.#rootElement.innerHTML = ''
        if (viewModelDTO.status !== GAME_STATUSES.FINISHED) {
            this.settingsCreator.settingsInitialization(viewModelDTO.status, viewModelDTO.settings)
        }

        if (viewModelDTO.status === GAME_STATUSES.IN_PROGRESS) {
            this.gameResultsCreator.gameResults({...viewModelDTO.gameEntities, watch: this.#clockShaper.getTime(viewModelDTO.watch)})
            this.#rootElement.append(this.gridBuilderCreator.gridBuilder(viewModelDTO.settings.gridSize, viewModelDTO.gameEntities))
        }

        if (viewModelDTO.status === GAME_STATUSES.FINISHED) {
            this.resultModalCreator.resultModal(viewModelDTO.winner)
        }
    }
}