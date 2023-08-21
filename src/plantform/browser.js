import {_canvasEl} from "./platform.js";
import {AbstractApi} from "./abstractPlatform.js";

export class BrowserApi extends AbstractApi {

    createImage() {
        return new Image()
    }

    getCanvasBoundingClientRect() {
        return _canvasEl.getBoundingClientRect();
    }

    getDPR() {
        return window.devicePixelRatio
    }

    requestAnimationFrame(callback) {
        window.requestAnimationFrame(callback)
    }
}