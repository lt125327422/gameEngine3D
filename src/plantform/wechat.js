import {_canvasEl} from "./platform.js";
import {AbstractApi} from "./abstractPlatform.js";

export class WechatApi extends AbstractApi {

    createImage() {
        return _canvasEl.createImage()
    }

    getCanvasBoundingClientRect() {
        const {
            _top: top, _left: left,
            _height: height, _width: width
        } = _canvasEl;
        return {top, left, width, height,}
    }

    getDPR() {
        return wx.getSystemInfoSync().pixelRatio
    }

    requestAnimationFrame(callback) {
        _canvasEl.requestAnimationFrame(callback)
    }
}