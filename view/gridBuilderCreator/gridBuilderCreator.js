export class GridBuilderCreator{
    gridBuilder(gridSize, gameEntities) {
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
}