import {GAME_STATUSES} from "../model/game.js";

export class View {
    #rootElement;
    settings = {
        gridSize: {
            rowsCount: 3,
            columnsCount: 3
        },
        jumpInterval: 1000, // milliseconds
        pointsToWin: 20,
        pointsForJump: 2,
        pointsForCapture: 5
    }
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
    #onStartGameHandler

    constructor(elementId) {
        this.#rootElement = document.getElementById(elementId);
    }

    render(viewModelDTO) {
        this.#rootElement.innerHTML = ''
        if (viewModelDTO.status === GAME_STATUSES.PENDING) {
            this.#settingsInitialization()
        }
        if (viewModelDTO.status === GAME_STATUSES.IN_PROGRESS) {
            this.#rootElement.append(this.#gridBuilder(viewModelDTO.gridSize, viewModelDTO.gameEntities))
        }
        if(viewModelDTO.status === GAME_STATUSES.FINISHED){
            const status = document.createElement('div')
            status.textContent = viewModelDTO.status
            this.#rootElement.append(status)
        }
    }

    set onStartGame(callback) {
        this.#onStartGameHandler = () => callback(this.settings)
    }

    //-------------------------------------------Select
    #changeSettings(newValue) {
        this.settings = {...this.settings, ...newValue}
    }

    #selectCreator(className, arrOptions) {
        const select = document.createElement('select')
        select.className = className
        arrOptions.forEach(el => {
            const option = document.createElement('option');
            option.value = JSON.stringify(el.value)
            option.textContent = el.content
            select.appendChild(option);
        })
        return select
    }

    #workingWithSelect(className, settingName, title) {
        const titleSelect = document.createElement('div')
        titleSelect.textContent = title
        const select = this.#selectCreator(className, this.#valuesData[settingName])
        select.addEventListener('change', (e) => {
            this.#changeSettings({[settingName]: JSON.parse(e.target.value)})
        })
        this.#rootElement.appendChild(titleSelect)
        this.#rootElement.appendChild(select)
        return select
    }

    #settingsInitialization() {
        const gridSizeSelector = this.#workingWithSelect('selector', 'gridSize', 'Grid size')
        const pointsToWinSelector = this.#workingWithSelect('selector', 'pointsToWin', 'Points to win')
        const pointsForJumpSelector = this.#workingWithSelect('selector', 'pointsForJump', 'Points for jump G')
        const pointsForCaptureSelector = this.#workingWithSelect('selector', 'pointsForCapture', 'Points for capture')
        const startBtn = document.createElement('button')
        startBtn.append('START GAME')
        startBtn.addEventListener('click', () => {
            this.#onStartGameHandler()
            gridSizeSelector.disabled = true
            pointsToWinSelector.disabled = true
            pointsForJumpSelector.disabled = true
            pointsForCaptureSelector.disabled = true
        })
        this.#rootElement.appendChild(startBtn)
    }

     #gridBuilder(gridSize, gameEntities) {
        const {google, player1, player2} = gameEntities

        const gridEl = document.createElement('table')
        for (let y = 0; y < gridSize.columnsCount; y++) {
            const rowEl = document.createElement('tr')
            for (let x = 0; x < gridSize.rowsCount; x++) {
                const cellEl = document.createElement('td')
                if (google.position.x === x && google.position.y === y) {
                    const googleEl = document.createTextNode('G')
                    googleEl.className = 'google'
                    cellEl.appendChild(googleEl)
                }
                if (player1.position.x === x && player1.position.y === y) {
                    const player1El = document.createTextNode('1')
                    player1El.className = 'player1'
                    cellEl.appendChild(player1El)
                }
                if(player2.position.x === x && player2.position.y === y){
                    const player2El = document.createTextNode('2')
                    player2El.className = 'player2'
                    cellEl.appendChild(player2El)
                }

                rowEl.append(cellEl)
            }
            gridEl.append(rowEl)
        }
        return gridEl
    }
}