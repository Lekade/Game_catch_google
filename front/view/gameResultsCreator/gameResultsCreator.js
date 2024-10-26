export class GameResultsCreator{
    resultTable = [
        {title: 'Player 1', imgSrc: './front/assets/img/icons/man01.svg', name: 'player1'},
        {title: 'Player 2', imgSrc: './front/assets/img/icons/man02.svg', name: 'player2'},
        {title: 'Google', imgSrc: './front/assets/img/icons/googleIcon.svg', name: 'google'}
    ]
    #rootElement
    constructor(rootElement) {
        this.#rootElement = rootElement
    }

    gameResults(results) {
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
}