export class ResultModalCreator{
    #rootElement
    #clockShaper
    #nextGameHandler
    #backToSettingsHandler

    constructor(rootElement, clockShaper, nextGameHandler, backToSettingsHandler) {
        this.#rootElement = rootElement
        this.#clockShaper = clockShaper
        this.#nextGameHandler = nextGameHandler
        this.#backToSettingsHandler = backToSettingsHandler
    }

    resultModal(winner){
        const modal = document.createElement('div')
        modal.className = 'modal'

        const modalDecoration = document.createElement('div')
        modalDecoration.className = 'modal-decoration'
        const imgDecoration = document.createElement('img')
        imgDecoration.src = winner.name === 'google' ? './front/assets/img/icons/lossIcon.svg' : './front/assets/img/icons/winnerIcon.svg'
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
        playAgainBtn.addEventListener('click', this.#nextGameHandler)

        const goToSettings = document.createElement('button')
        goToSettings.className = 'btn'
        goToSettings.append('Go to settings')
        goToSettings.addEventListener('click', this.#backToSettingsHandler)

        modalElement.append(titleModal, modalResult, playAgainBtn, goToSettings)

        modal.append(modalDecoration, modalElement)
        this.#rootElement.appendChild(modal)
    }
}