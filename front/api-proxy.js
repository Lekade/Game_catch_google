import {SERVER_ACTION_TYPES} from "../common/serverActionTypes.js";

export class APIProxy {
    #socketTunnel;
    #observers = []

    constructor(url = 'wss://catchthegoogle.glitch.me') {
        this.#socketTunnel = new WebSocket(url);

        this.#socketTunnel.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            this.#observers.forEach(o => o(data))
        })

        this.#socketTunnel.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

    }

    addEventListener(subscriber) {
        this.#observers.push(subscriber)
    }

    setSetting(settingName, value) {
        this.#socketTunnel.send(JSON.stringify({
            type: SERVER_ACTION_TYPES.SET_SETTING,
            payload: {
                settingName,
                value
            }
        }));
    }

    startGame() {
        this.#socketTunnel.send(JSON.stringify({
            type: SERVER_ACTION_TYPES.START_GAME,
        }));
    }

    movePlayer(direction, player){
        this.#socketTunnel.send(JSON.stringify({
            type: SERVER_ACTION_TYPES.MOVE_PLAYER,
            payload:{
                direction,
                player
            }
        }));
    }

    nextGame() {
        this.#socketTunnel.send(JSON.stringify({
            type: SERVER_ACTION_TYPES.NEXT_GAME,
        }));
    }

    backToSettings() {
        this.#socketTunnel.send(JSON.stringify({
            type: SERVER_ACTION_TYPES.BACK_TO_SETTINGS,
        }));
    }

}