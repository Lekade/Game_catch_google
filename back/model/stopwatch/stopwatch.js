export class Stopwatch {
    #seconds
    #interval
    constructor() {
        this.#seconds = 0;
        this.#interval = null;
    }

    start() {
        this.#seconds = 0
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.#seconds++;
            }, 1000);
        }
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    get seconds(){
        return this.#seconds
    }
}
