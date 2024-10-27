import {Game} from "./model/game.js";
import {SERVER_ACTION_TYPES} from "../common/serverActionTypes.js";
import {NumberUtility} from "./model/positionManager/number-utility.js";

const server = new WebSocketServer({ port: 8080 });

const numberUtility = new NumberUtility()
const model = new Game(numberUtility)
server.on('connection', (ws) => {
    console.log('New client connected');

    const getGameData = async () => {
        return {
            status: await model.getStatus(),
            settings: await model.settings.getSettings(),
            gameEntities: {
                google: await model.getEntity('google'),
                player1: await model.getEntity('player1'),
                player2: await model.getEntity('player2')
            },
            watch: await model.getWatch(),
            winner: await model.getWinner()
        }
    }

    (async () => {
        const data = await getGameData()
        ws.send(JSON.stringify(data))
    })();

    model.addEventListener(async () => {
        ws.send(JSON.stringify(await getGameData()))
    })


    ws.on('message', async (message) => {
        const action = JSON.parse(message)
        switch (action.type) {
            case SERVER_ACTION_TYPES.SET_SETTING: {
                const {settingName, value} = action.payload
                await model.settings.setSetting(settingName, value)
                break
            }
            case SERVER_ACTION_TYPES.START_GAME: {
                await model.lifeCycleManager.start()
                break
            }
            case SERVER_ACTION_TYPES.MOVE_PLAYER: {
                const {direction, player} = action.payload
                await model.playerMoveManager.movePlayer(direction, player)
                break
            }
            case SERVER_ACTION_TYPES.NEXT_GAME: {
                await model.lifeCycleManager.nextGame()
                break
            }
            case SERVER_ACTION_TYPES.BACK_TO_SETTINGS: {
                await model.lifeCycleManager.backToSettings()
                break
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });
});
