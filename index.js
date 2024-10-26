// entry point
import {View} from "./front/view/view.js";
import {NetworkController} from "./front/network-controller.js";
import {APIProxy} from "./front/api-proxy.js";


const apiProxy = new APIProxy()
const view = new View('app')

const controller = new NetworkController(view, apiProxy)

controller.init();
