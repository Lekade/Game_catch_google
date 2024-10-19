import {GAME_STATUSES} from "../common/gameStatuses.js";
import {MOVE_DIRECTIONS} from "../common/moveDirections.js";
import {clockShaper} from "./clockShaper/clockShaper.js";


export class View {
    #rootElement;
    settings = {
        gridSize: {
            rowsCount: 3,
            columnsCount: 3
        },
        jumpInterval: 1000,
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

    #key = {
        'arrowup': [MOVE_DIRECTIONS.UP, 'player1'],
        'arrowdown': [MOVE_DIRECTIONS.DOWN, 'player1'],
        'arrowleft': [MOVE_DIRECTIONS.LEFT, 'player1'],
        'arrowright': [MOVE_DIRECTIONS.RIGHT, 'player1'],
        'w': [MOVE_DIRECTIONS.UP, 'player2'],
        's': [MOVE_DIRECTIONS.DOWN, 'player2'],
        'a': [MOVE_DIRECTIONS.LEFT, 'player2'],
        'd': [MOVE_DIRECTIONS.RIGHT, 'player2'],
        'ц': [MOVE_DIRECTIONS.UP, 'player2'],
        'ы': [MOVE_DIRECTIONS.DOWN, 'player2'],
        'ф': [MOVE_DIRECTIONS.LEFT, 'player2'],
        'в': [MOVE_DIRECTIONS.RIGHT, 'player2'],
    }

    resultTable = [
        {title: 'Player 1', imgSrc: '../assets/img/icons/man01.svg', name: 'player1'},
        {title: 'Player 2', imgSrc: '../assets/img/icons/man02.svg', name: 'player2'},
        {title: 'Google', imgSrc: '../assets/img/icons/googleIcon.svg', name: 'google'}
    ]

    #startGameHandler
    #movePlayerHandler
    #clockShaper


    constructor(elementId) {
        this.#clockShaper = new  clockShaper()

        this.#rootElement = document.getElementById(elementId);

        document.addEventListener('keydown', this.keyDownHandler.bind(this));
    }

    keyDownHandler(e) {
        const params = this.#key[e.key.toLowerCase()]
        if (params) {
            this.#movePlayerHandler(...params)
        }
    }

    set movePlayerCallback(callback) {
        this.#movePlayerHandler = (direction, player) => callback(direction, player)
    }

    render(viewModelDTO) {
        this.#rootElement.innerHTML = ''
        if (viewModelDTO.status !== GAME_STATUSES.FINISHED) {
            this.#settingsInitialization(viewModelDTO.status, viewModelDTO.settings)
        }

        if (viewModelDTO.status === GAME_STATUSES.IN_PROGRESS) {
            this.#gameResults({...viewModelDTO.gameEntities, watch: this.#clockShaper.getTime(viewModelDTO.watch)})
            this.#rootElement.append(this.#gridBuilder(viewModelDTO.settings.gridSize, viewModelDTO.gameEntities))
        }

        if (viewModelDTO.status === GAME_STATUSES.FINISHED) {
            this.#resultModalCreator(viewModelDTO.winner)
        }
    }

    set startGameCallback(callback) {
        this.#startGameHandler = () => callback(this.settings)
    }

    //-------------------------------------------Select
    #changeSettings(newValue) {
        this.settings = {...this.settings, ...newValue}
    }

    #selectCreator(className, arrOptions) {
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

    #workingWithSelect(className, settingName, title) {
        const settingContainer = document.createElement('div')
        settingContainer.className = 'settingContainer'
        const titleSelect = document.createElement('span')
        titleSelect.className = 'settingTitle'
        titleSelect.textContent = title
        const select = this.#selectCreator(className, this.#valuesData[settingName])
        select.id = settingName
        select.className = 'settingSelect'
        select.addEventListener('change', (e) => {
            this.#changeSettings({[settingName]: JSON.parse(e.target.value)})
        })
        settingContainer.appendChild(titleSelect)
        settingContainer.appendChild(select)
        return {select, settingContainer}
    }

    #settingsInitialization(status, settings) {
        const settingsWrapper = document.createElement('div')
        settingsWrapper.className = 'settingsWrapper'
        const {select:gridSizeSelector , settingContainer: setContainer1 } = this.#workingWithSelect('selector', 'gridSize', 'Grid size')
        const {select:pointsToWinSelector, settingContainer: setContainer2 } = this.#workingWithSelect('selector', 'pointsToWin', 'Points to win')
        const {select:pointsForJumpSelector, settingContainer: setContainer3 } = this.#workingWithSelect('selector', 'pointsForJump', 'Points for jump G')
        const {select:pointsForCaptureSelector, settingContainer: setContainer4 } = this.#workingWithSelect('selector', 'pointsForCapture', 'Points for capture')

        settingsWrapper.append(setContainer1, setContainer2, setContainer3, setContainer4)
        this.#rootElement.appendChild(settingsWrapper)

        if (status === GAME_STATUSES.PENDING) {
            const startBtn = document.createElement('button')
            startBtn.className = 'btn startGame'
            startBtn.append('START GAME')
            startBtn.addEventListener('click', () => {
                this.#startGameHandler()
            })
            this.#rootElement.appendChild(startBtn)
        }

        if (status !== GAME_STATUSES.PENDING) {
            [gridSizeSelector, pointsToWinSelector, pointsForJumpSelector, pointsForCaptureSelector].forEach(select => {
                select.value = JSON.stringify(settings[select.id])
                select.disabled = true
            })
        }

    }

    #gameResults(results) {
        const resultsWrapper = document.createElement('ul')
        resultsWrapper.className = 'resultsWrapper'
        this.resultTable.forEach(el => {
            const entity = document.createElement('li')
            entity.className = 'resultTableEntity'
            const title = document.createElement('span')
            title.className = 'resultTableTitle'
            title.append(el.title)
            entity.appendChild(title)

            const img = document.createElement('img')
            img.className = 'resultTableImg'
            img.src = el.imgSrc
            entity.appendChild(img)

            const points = document.createElement('span')
            points.className = 'resultTablePoint'
            points.append(results[el.name].points)
            entity.appendChild(points)
            resultsWrapper.appendChild(entity)
        })

        const gameTime = document.createElement('li')
        gameTime.className = 'resultTableEntity'
        const titleTime = document.createElement('span')
        titleTime.className = 'resultTableTitle'
        titleTime.append('Time')
        gameTime.appendChild(titleTime)
        const time = document.createElement('span')
        time.className = 'resultTablePoint'
        time.append(results.watch)
        gameTime.appendChild(time)
        resultsWrapper.appendChild(gameTime)
        this.#rootElement.appendChild(resultsWrapper)
    }

    #gridBuilder(gridSize, gameEntities) {
        const {google, player1, player2} = gameEntities

        const gridEl = document.createElement('table')
        gridEl.className = 'gameField'
        for (let y = 0; y < gridSize.columnsCount; y++) {
            const rowEl = document.createElement('tr')
            for (let x = 0; x < gridSize.rowsCount; x++) {
                const cellEl = document.createElement('td')
                if (google.position && google.position.x === x && google.position.y === y) {
                    const googleEl = document.createElement('img')
                    googleEl.src = '../assets/img/icons/googleIcon.svg'
                    googleEl.className = 'entity'
                    cellEl.appendChild(googleEl)
                }
                if (player1.position.x === x && player1.position.y === y) {
                    const player1El = document.createElement('img')
                    player1El.src = '../assets/img/icons/man01.svg'
                    player1El.className = 'entity'
                    cellEl.appendChild(player1El)
                }
                if (player2.position.x === x && player2.position.y === y) {
                    const player2El = document.createElement('img')
                    player2El.src = '../assets/img/icons/man02.svg'
                    player2El.className = 'entity'
                    cellEl.appendChild(player2El)
                }

                rowEl.append(cellEl)
            }
            gridEl.append(rowEl)
        }
        return gridEl
    }

    #resultModalCreator(winner){
        const modal = document.createElement('div')
        modal.className = 'modal'

        const modalDecoration = document.createElement('div')
        modalDecoration.className = 'modal-decoration'
        const imgDecoration = document.createElement('img')
        imgDecoration.src = winner.name === 'google' ? '../assets/img/icons/lossIcon.svg' : '../assets/img/icons/winnerIcon.svg'
        modalDecoration.appendChild(imgDecoration)


        const modalElement = document.createElement('div')
        modalElement.className = 'modal-elements'

        const titleModal = document.createElement('div')
        titleModal.className = 'title-modal'
        titleModal.append(`${winner.name} Win!`)

        const modalResult = document.createElement('div')
        modalResult.className = 'modal-result';

        ['Points', winner.points, 'Time', this.#clockShaper.getTime(winner.time)].forEach(el=>{
            const resultEl = document.createElement('div')
            resultEl.className = 'result-el'
            resultEl.append(el)
            modalResult.appendChild(resultEl)
        })

        const playAgainBtn = document.createElement('button')
        playAgainBtn.className = 'btn'
        playAgainBtn.append('Play again')

        const goToSettings = document.createElement('button')
        goToSettings.className = 'btn'
        goToSettings.append('Go to settings')

        modalElement.append(titleModal, modalResult, playAgainBtn, goToSettings)

        modal.append(modalDecoration, modalElement)
        this.#rootElement.appendChild(modal)
    }
}