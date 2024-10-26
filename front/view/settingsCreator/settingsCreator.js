import {GAME_STATUSES} from "../../../common/gameStatuses.js";

export class SettingsCreator{
    #valuesData = {
        gridSize: [
            {content: '3x3', value: {rowsCount: 3, columnsCount: 3}},
            {content: '4x4', value: {rowsCount: 4, columnsCount: 4}},
            {content: '5x5', value: {rowsCount: 5, columnsCount: 5}},
        ],
        pointsToWin: [
            {content: '20', value: 20},
            {content: '30', value: 30},
            {content: '40', value: 40}
        ],
        pointsForJump: [
            {content: '2', value: 2},
            {content: '5', value: 5},
            {content: '10', value: 10}
        ],
        pointsForCapture: [
            {content: '5', value: 5},
            {content: '10', value: 10},
            {content: '20', value: 20}
        ],
    }
    #rootElement
    #setSettingHandler
    #startGameHandler
    constructor(rootElement, setSettingHandler, startGameHandler) {
        this.#rootElement = rootElement
        this.#setSettingHandler = setSettingHandler
        this.#startGameHandler = startGameHandler
    }

    #selectCreator(arrOptions) {
        const select = document.createElement('select')
        select.className = 'settingsSelect'
        arrOptions.forEach(el => {
            const option = document.createElement('option');
            option.value = JSON.stringify(el.value)
            option.textContent = el.content
            select.appendChild(option);
        })
        return select
    }

    #workingWithSelect(settings, settingName, title) {
        const settingContainer = document.createElement('div')
        settingContainer.className = 'settingContainer'
        const titleSelect = document.createElement('span')
        titleSelect.className = 'settingTitle'
        titleSelect.textContent = title
        const select = this.#selectCreator(this.#valuesData[settingName])
        select.id = settingName
        select.className = 'settingSelect'
        select.value = JSON.stringify(settings[settingName])
        select.addEventListener('change', (e) => {
            const value = JSON.parse(e.target.value)
            this.#setSettingHandler(settingName, value)
        })
        settingContainer.appendChild(titleSelect)
        settingContainer.appendChild(select)
        return {select, settingContainer}
    }

    settingsInitialization(status, settings) {
        const settingsWrapper = document.createElement('div')
        settingsWrapper.className = 'settingsWrapper'
        const {select:gridSizeSelector , settingContainer: setContainer1 } = this.#workingWithSelect(settings, 'gridSize', 'Grid size')
        const {select:pointsToWinSelector, settingContainer: setContainer2 } = this.#workingWithSelect(settings, 'pointsToWin', 'Points to win')
        const {select:pointsForJumpSelector, settingContainer: setContainer3 } = this.#workingWithSelect(settings, 'pointsForJump', 'Points for jump G')
        const {select:pointsForCaptureSelector, settingContainer: setContainer4 } = this.#workingWithSelect(settings, 'pointsForCapture', 'Points for capture')

        settingsWrapper.append(setContainer1, setContainer2, setContainer3, setContainer4)
        this.#rootElement.appendChild(settingsWrapper)

        if (status === GAME_STATUSES.PENDING) {
            const startBtn = document.createElement('button')
            startBtn.className = 'btn startGame'
            startBtn.append('START GAME')
            startBtn.addEventListener('click', this.#startGameHandler)
            this.#rootElement.appendChild(startBtn)
        }

        if (status !== GAME_STATUSES.PENDING) {
            [gridSizeSelector, pointsToWinSelector, pointsForJumpSelector, pointsForCaptureSelector].forEach(select => {
                select.value = JSON.stringify(settings[select.id])
                select.disabled = true
            })
        }

    }
}