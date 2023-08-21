import {WechatApi} from "./wechat.js";
import {BrowserApi} from "./browser.js";

const PLATFORM_TYPE = {
    WECHAT: "WECHAT",
    BROWSER: "BROWSER",
    UNKNOWN: "UNKNOWN",
}

/**
 * @public
 * @type {Platform} implementationPlatform
 */
export let platform = null

export let _canvasEl = null

//  whether is We Chat or other platform
const getCurrentPlatform = () => {
    if (!_canvasEl) {
        return PLATFORM_TYPE.UNKNOWN
    }

    if (_canvasEl.getBoundingClientRect &&
        window &&
        window.devicePixelRatio &&
        window.requestAnimationFrame && typeof window.requestAnimationFrame == "function" &&
        window.Image && typeof window.Image == "function"
    ) {
        return PLATFORM_TYPE.BROWSER
    } else if (
        wx && wx.getSystemInfoSync &&
        _canvasEl.requestAnimationFrame && typeof _canvasEl.requestAnimationFrame == "function" &&
        _canvasEl.createImage && typeof _canvasEl.createImage == "function"
    ) {
        return PLATFORM_TYPE.WECHAT
    } else {
        return PLATFORM_TYPE.UNKNOWN
    }
}

/**
 * @public
 * @param canvasEl
 * @return {Platform}
 */
export const setupPlatform = ({canvasEl}) => {
    _canvasEl = canvasEl
    getCurrentPlatform()
    return (platform = new Platform())
}

class Platform {

    constructor() {
        /**
         * @type {AbstractApi} implementationPlatform
         */
        this.concreateImplementationPlatform = (() => {
            switch (getCurrentPlatform()) {
                case PLATFORM_TYPE.WECHAT:
                    return new WechatApi()
                case PLATFORM_TYPE.BROWSER:
                    return new BrowserApi()
                case PLATFORM_TYPE.UNKNOWN:
                    return null
            }
        })()
    }

    createImage() {
        return this.concreateImplementationPlatform.createImage()
    }

    getBoundingClientRect() {
        return this.concreateImplementationPlatform.getCanvasBoundingClientRect()
    }

    /**
     * @return number
     */
    getDPR() {
        return this.concreateImplementationPlatform.getDPR()
    }

    /**
     * @return void
     */
    requestAnimationFrame(callback) {
        this.concreateImplementationPlatform.requestAnimationFrame(callback)
    }
}
