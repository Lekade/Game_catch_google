// entry point
import {View} from "./view/view.js";
import {Controller} from "./controller.js";
import {Game} from "./model/game.js";
import {NumberUtility} from "./model/positionManager/number-utility.js";

const numberUtility = new NumberUtility()
const model = new Game(numberUtility)

const view = new View('app')

const controller = new Controller(view, model)

controller.init();
