import {GAME_STATUSES} from "../comon/gameStatuses.js";
import {MOVE_DIRECTIONS} from "../comon/moveDirections.js";


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
        {title: 'Player 1', imgSrc: 'ksdjfksdfj', name: 'player1'},
        {title: 'Player 2', imgSrc: 'ksdjfksdfj', name: 'player2'},
        {title: 'Google', imgSrc: 'ksdjfksdfj', name: 'google'}
    ]

    #startGameHandler
    #movePlayerHandler


    constructor(elementId) {
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
        this.#settingsInitialization(viewModelDTO.status, viewModelDTO.settings)

        if (viewModelDTO.status === GAME_STATUSES.IN_PROGRESS) {
            this.#gameResults(viewModelDTO.gameEntities)
            this.#rootElement.append(this.#gridBuilder(viewModelDTO.settings.gridSize, viewModelDTO.gameEntities))
        }

        if (viewModelDTO.status === GAME_STATUSES.FINISHED) {
            const status = document.createElement('div')
            status.textContent = viewModelDTO.status
            this.#rootElement.append(status)
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
        const settingContainer = document.createElement('div')
        settingContainer.className = 'settingContainer'
        const titleSelect = document.createElement('span')
        titleSelect.textContent = title
        const select = this.#selectCreator(className, this.#valuesData[settingName])
        select.id = settingName
        select.addEventListener('change', (e) => {
            this.#changeSettings({[settingName]: JSON.parse(e.target.value)})
        })
        settingContainer.appendChild(titleSelect)
        settingContainer.appendChild(select)
        this.#rootElement.appendChild(settingContainer)
        return select
    }

    #settingsInitialization(status, settings) {
        const gridSizeSelector = this.#workingWithSelect('selector', 'gridSize', 'Grid size')
        const pointsToWinSelector = this.#workingWithSelect('selector', 'pointsToWin', 'Points to win')
        const pointsForJumpSelector = this.#workingWithSelect('selector', 'pointsForJump', 'Points for jump G')
        const pointsForCaptureSelector = this.#workingWithSelect('selector', 'pointsForCapture', 'Points for capture')

        if (status === GAME_STATUSES.PENDING) {
            const startBtn = document.createElement('button')
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
        this.resultTable.forEach(el => {
            const entity = document.createElement('li')

            const title = document.createElement('span')
            title.className = 'resultTableTitle'
            title.append(el.title)
            entity.appendChild(title)

            const img = document.createElement('img')
            img.className = 'resultTableImg'
            img.src = el.imgSrc
            entity.appendChild(img)

            const points = document.createElement('span')
            points.append(results[el.name].points)
            entity.appendChild(points)
            resultsWrapper.appendChild(entity)
        })

        const gameTime = document.createElement('li')
        const titleTime = document.createElement('span')
        titleTime.className = 'resultTableTitle'
        titleTime.append('Time')
        gameTime.appendChild(titleTime)
        const time = document.createElement('span')
        time.append('00:00')
        gameTime.appendChild(time)
        resultsWrapper.appendChild(gameTime)
        this.#rootElement.appendChild(resultsWrapper)
    }

    #gridBuilder(gridSize, gameEntities) {
        const {google, player1, player2} = gameEntities

        const gridEl = document.createElement('table')
        for (let y = 0; y < gridSize.columnsCount; y++) {
            const rowEl = document.createElement('tr')
            for (let x = 0; x < gridSize.rowsCount; x++) {
                const cellEl = document.createElement('td')
                if (google.position && google.position.x === x && google.position.y === y) {
                    const googleEl = document.createTextNode('G')
                    googleEl.className = 'google'
                    cellEl.appendChild(googleEl)
                }
                if (player1.position.x === x && player1.position.y === y) {
                    const player1El = document.createTextNode('1')
                    player1El.className = 'player1'
                    cellEl.appendChild(player1El)
                }
                if (player2.position.x === x && player2.position.y === y) {
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