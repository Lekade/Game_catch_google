import {MOVE_DIRECTIONS} from "../../../common/moveDirections.js";

export class KeyHandler {
    keyMappings = {
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
    movePlayerCallback
    constructor( movePlayerCallback) {
        this.movePlayerCallback = movePlayerCallback;
        document.addEventListener('keydown', this.keyDownHandler.bind(this));
    }

    keyDownHandler(e) {
        const key = e.key.toLowerCase();
        const params = this.keyMappings[key];
        if (params) {
            const [direction, player] = params;
            this.movePlayerCallback(direction, player);
        }
    }
}
