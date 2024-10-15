import {Game} from "./game.js";
import {NumberUtility} from "./number-utility.js";


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

    it("should return Pending status as inital", async () => {
        let status  = await game.getStatus()
        expect(status).toBe("PENDING")
    })

    it("should return In-progress status after start()", async () => {
        await game.start()
        let status  = await game.getStatus()
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
        let googlePosition  = await game.getGooglePosition()
        let googlePosition2  = await game.getGooglePosition()

        expect(googlePosition).toBeEqualPosition(googlePosition2)

        expect(googlePosition.x).toBeGreaterThanOrEqual(0)
        expect(googlePosition.x).toBeLessThanOrEqual(3)

        expect(googlePosition.y).toBeGreaterThanOrEqual(0)
        expect(googlePosition.y).toBeLessThanOrEqual(2)
    })

    it("google should have random correct positions after jump interval", async () => {
        for (let i=0;i<10;i++) {
            createGame()
            await game.setSettings({
                gridSize: {
                    rowsCount: 1,
                    columnsCount: 2 // x
                },
                jumpInterval: 10 // 3 seconds
            })
            await game.start()
            let googlePosition  = await game.getGooglePosition()
            await delay(10)
            let googlePosition2  = await game.getGooglePosition()
            expect(googlePosition).not.toBeEqualPosition(googlePosition2)
        }
    })
})


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

