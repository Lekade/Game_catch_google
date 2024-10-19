export class clockShaper {
    constructor() {

    }
    getTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = sec < 10 ? '0' + sec : sec;

        return  formattedMinutes + ":" + formattedSeconds
    }
}


