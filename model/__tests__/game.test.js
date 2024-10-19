import {Game} from "../game.js";
import {NumberUtility} from "../number-utility.js";
import {Position} from "../position.js";
import {MOVE_DIRECTIONS} from "../../common/moveDirections.js";
import {GAME_STATUSES} from "../../common/gameStatuses.js";


expect.extend({
    toBeEqualPosition(received, expected) {
        const pass = received.isEqual(expected);

        if (pass) {
            return {
                message: () => `expected Position(${received.x}, ${received.y}) not to be equal to Position(${expected.x}, ${expected.y})`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected Position(${received.x}, ${received.y}) to be equal to Position(${expected.x}, ${expected.y})`,
                pass: false,
            };
        }
    }
});


describe("Game", () => {
    let game;

    // composition root
    function createGame() {
        const numberUtility = new NumberUtility()
        //const numberUtility = new NumberAPIUtility()
        game = new Game(numberUtility);
    }

    beforeEach(async () => {
        createGame();
    })

    afterEach(async () => {
        game.stop();
    })

    it("should return Pending status as inital", async () => {
        let status = await game.getStatus()
        expect(status).toBe("PENDING")
    })

    it("should return In-progress status after start()", async () => {
        await game.start()
        let status = await game.getStatus()
        expect(status).toBe("IN-PROGRESS")
    })

    it("google should have random correct positions after start", async () => {
        await game.setSettings({
            gridSize: {
                rowsCount: 3,
                columnsCount: 4 // x
            }
        })
        await game.start()
        let googlePosition = await game.getPosition('google')
        let googlePosition2 = await game.getPosition('google')

        expect(googlePosition).toBeEqualPosition(googlePosition2)

        expect(googlePosition.x).toBeGreaterThanOrEqual(0)
        expect(googlePosition.x).toBeLessThanOrEqual(3)

        expect(googlePosition.y).toBeGreaterThanOrEqual(0)
        expect(googlePosition.y).toBeLessThanOrEqual(2)
    })

    it("google should have random correct positions after jump interval", async () => {
        for (let i = 0; i < 10; i++) {
            createGame()
            await game.setSettings({
                gridSize: {
                    rowsCount: 1,
                    columnsCount: 4 // x
                },
                jumpInterval: 10 // 3 seconds
            })
            await game.start()
            let googlePosition = await game.getPosition('google')
            await delay(10)
            let googlePosition2 = await game.getPosition('google')
            expect(googlePosition2).not.toBeEqualPosition(googlePosition)
            game.stop()
        }
    })

    it("player1 should have random correct positions inside grid after start", async () => {
        await game.setSettings({
            gridSize: {
                rowsCount: 3,
                columnsCount: 4 // x
            }
        })
        await game.start()
        let player1Position = await game.getPosition('player1')
        expect(player1Position.x).toBeGreaterThanOrEqual(0)
        expect(player1Position.x).toBeLessThanOrEqual(3)

        expect(player1Position.y).toBeGreaterThanOrEqual(0)
        expect(player1Position.y).toBeLessThanOrEqual(2)
    })

    it("player1 should have random correct position not crossed with google after start", async () => {
        for (let i = 0; i < 40; i++) {
            createGame()

            await game.setSettings({
                gridSize: {
                    rowsCount: 4,
                    columnsCount: 1 // x
                }
            })
            await game.start()
            let googlePosition = await game.getPosition('google')
            let player1Position = await game.getPosition('player1')

            expect(player1Position).not.toBeEqualPosition(googlePosition)

            game.stop()
        }
    })

    it("moving of player1 is correct", async () => {

        const numberUtil = new MockFakeNumberUtility([
            /*player1*/ 2,2,
            /*player2*/ 2,0,
            /*google*/ 0, 2
        ], '1')
        const game = new Game(numberUtil);

        await game.setSettings({
            gridSize: {
                rowsCount: 3,
                columnsCount: 3 // x
            }
        })

        await game.start()
        let position = await game.getPosition('player1')
        let googlePosition = await game.getPosition('google')
        expect(position).toBeEqualPosition(new Position(2,2))
        expect(googlePosition).toBeEqualPosition(new Position(0,2))
        // [  ][  ][p2]
        // [  ][  ][  ]
        // [ g][  ][p1]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.DOWN, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(2, 2));
        // [  ][  ][p2]
        // [  ][  ][  ]
        // [ g][  ][p1]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.RIGHT, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(2, 2))
        // [  ][  ][p2]
        // [  ][  ][  ]
        // [ g][  ][p1]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.UP, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(2, 1))
        // [  ][  ][p2]
        // [  ][  ][p1]
        // [ g][  ][  ]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.LEFT, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(1, 1))
        // [  ][  ][p2]
        // [  ][p1][  ]
        // [ g][  ][  ]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.UP, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(1, 0))
        // [  ][p1][p2]
        // [  ][  ][  ]
        // [ g][  ][  ]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.UP, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(1, 0))
        // [  ][p1][p2]
        // [  ][  ][  ]
        // [ g][  ][  ]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.LEFT, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(0, 0))
        // [p1][  ][p2]
        // [  ][  ][  ]
        // [ g][  ][  ]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.LEFT, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(0, 0))
        // [p1][  ][p2]
        // [  ][  ][  ]
        // [ g][  ][  ]
        // ===========
        await game.movePlayer(MOVE_DIRECTIONS.DOWN, 'player1')
        position = await game.getPosition('player1')
        expect(position).toBeEqualPosition(new Position(0, 1))
        // [  ][  ][p2]
        // [p1][  ][  ]
        // [ g][  ][  ]
        // ===========
        await game.stop()
    })
    //
    it("should award points to player1 for catching Google but not finish the game if points are less than pointsToWin", async () => {
        const numberUtil = new MockFakeNumberUtility([
            /*player1*/ 2, 2,
            /*player2*/ 1, 1,
            /*google*/ 0, 0,
            /*google*/ 0, 2,
        ], '2');
        const game = new Game(numberUtil);

        // Настраиваем игру с требуемыми баллами для победы
        await game.setSettings({
            gridSize: { rowsCount: 3, columnsCount: 3 },
            pointsToWin: 10,
            pointsForCapture: 3
        });

        await game.start();

        // Проверяем стартовые позиции
        let player1Position = await game.getPosition('player1');
        let googlePosition = await game.getPosition('google');
        expect(player1Position).toBeEqualPosition(new Position(2, 2));
        expect(googlePosition).toBeEqualPosition(new Position(0, 0));

        // Передвигаем player1 на позицию гугла
        await game.movePlayer(MOVE_DIRECTIONS.UP, 'player1'); // 2, 1
        await game.movePlayer(MOVE_DIRECTIONS.LEFT, 'player1'); // 1, 1 (1ый наступает на игрока 2)???
        await game.movePlayer(MOVE_DIRECTIONS.UP, 'player1'); // 1, 0
        await game.movePlayer(MOVE_DIRECTIONS.LEFT, 'player1'); // 0, 0 (ловит Google)

        // Проверяем, что игрок поймал Google
        player1Position = await game.getPosition('player1');
        googlePosition = await game.getPosition('google');
        expect(player1Position).toBeEqualPosition(new Position(0, 0)); // Игрок на позиции гугла
        expect(googlePosition).not.toBeEqualPosition(player1Position); // Гугл переместился

        // Проверяем очки игрока и статус игры

        const player1Points = await game.getPoints('player1');
        expect(player1Points).toBe(3); // 3 очка за поимку
        const gameStatus = await game.getStatus();
        expect(gameStatus).toBe(GAME_STATUSES.IN_PROGRESS); // Игра продолжается
        await game.stop()
    });

    it("Google jumps multiple times and wins the game", async () => {
        const numberUtil = new MockFakeNumberUtility([
            /*player1*/ 2, 2,
            /*player2*/ 1, 1,
            /*google*/ 0, 0, // Начальная позиция Гугла
            /*google jump 1*/ 1, 0,
            /*google jump 2*/ 2, 1
        ], '3');
        const game = new Game(numberUtil);

        await game.setSettings({
            gridSize: {
                rowsCount: 3,
                columnsCount: 3,
            },
            pointsForJump: 5,  // За каждый прыжок Google получает 5 очков
            pointsToWin: 10,   // Для победы нужно 10 очков
            jumpInterval: 10,  // Быстрый интервал для теста
        });

        await game.start();

        let googlePoints = await game.getPoints('google');
        expect(googlePoints).toBe(0);  // Изначально у Google 0 баллов

        // Ждем первый прыжок
        await delay(10) // Ждем чуть больше времени, чем jumpInterval
        googlePoints = await game.getPoints('google');
        expect(googlePoints).toBe(5);  // Google получает 5 баллов за первый прыжок
        let status = await game.getStatus();
        expect(status).toBe('IN-PROGRESS');  // Игра продолжается

        // Ждем второй прыжок
        await delay(10);
        googlePoints = await game.getPoints('google');
        expect(googlePoints).toBe(10);  // Google получает еще 5 баллов и теперь у него 10
        status = await game.getStatus();
        expect(status).toBe('FINISHED');  // Игра закончилась, Google победил
    })

    it("Player catches Google, but does not win; then catches again and wins", async () => {
        const numberUtil = new MockFakeNumberUtility([
            /*player1*/ 1, 0, // Начальная позиция игрока
            /*player2*/ 2, 2,
            /*google*/ 0, 0, // Начальная позиция Google
            /*google jump*/ 1, 1, // Новая позиция Google после первого прыжка
        ], '4');
        const game = new Game(numberUtil);

        await game.setSettings({
            gridSize: {
                rowsCount: 3,
                columnsCount: 3,
            },
            pointsForCapture: 5,  // За поймание Google игрок получает 5 очков
            pointsForJump: 2,
            pointsToWin: 10,    // Для победы нужно 10 очков
            jumpInterval: 10,   // Быстрый интервал для теста
        });

        await game.start();

        let player1Points = await game.getPoints('player1');
        expect(player1Points).toBe(0);  // Изначально у игрока 0 очков

        // Игрок делает первый шаг и ловит Google
        await game.movePlayer(MOVE_DIRECTIONS.LEFT, 'player1');
        player1Points = await game.getPoints('player1');
        expect(player1Points).toBe(5);  // Игрок получает 5 очков за поимку Google

        let status = await game.getStatus();
        expect(status).toBe('IN-PROGRESS');  // Игра продолжается

        // Ждем, пока Google сделает свой прыжок
        let googlePosition = await game.getPosition('google');
        expect(googlePosition).toBeEqualPosition(new Position(1, 1));  // Проверяем новую позицию Google

        // Игрок делает еще два шага, чтобы поймать Google снова
        await game.movePlayer(MOVE_DIRECTIONS.DOWN, 'player1'); // Второй шаг
        await game.movePlayer(MOVE_DIRECTIONS.RIGHT, 'player1'); // Третий шаг

        player1Points = await game.getPoints('player1');
        expect(player1Points).toBe(10);  // Игрок получает еще 5 очков за вторую поимку Google

        status = await game.getStatus();
        expect(status).toBe('FINISHED');  // Игра закончена, игрок победил
    });

})

const delay = ms => new Promise(resolve =>  setTimeout(resolve, ms));

class MockFakeNumberUtility extends NumberUtility {
    #mockValues = []
    #id
    constructor(mockValues, id) {
        super();
        this.#mockValues = mockValues;
        this.#id = id
    }

    #callsCount = 0;
    getRandomNumber() {
        if (this.#mockValues[this.#callsCount] === undefined) throw new Error('Mock must have more values')
        const returnValue = this.#mockValues[this.#callsCount];
        this.#callsCount++;
        return returnValue;
    }
}