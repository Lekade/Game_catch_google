export class Entity {
    #position
    #points
    constructor() {
        this.#position = null
        this.#points = 0
    }
    get position(){
        return this.#position
    }
    set position(newPosition){
        this.#position = newPosition
    }
    get points(){
        return this.#points
    }
    set points(updatedPoints){
        this.#points = updatedPoints
    }
    reset(){
        this.position = null
        this.points = 0
    }
}