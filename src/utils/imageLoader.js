import {platform} from "../plantform";

export const TEXTURE_LOAD_STATUS = {
    UNLOADED: "UNLOADED",
    SUCCESS_LOADED: "SUCCESS_LOADED",
}

export class GameImage {
    constructor() {
        this.image = null
        this.loadStatus = TEXTURE_LOAD_STATUS.UNLOADED
    }
}

/**
 * bridge pattern(adapter pattern is not good at here)
 * compatibility with wx mp
 */
export class ImageLoader {

    constructor() {
        this.urlMap = new Map()
        this.loadQueue = []
    }

    isAllLoaded() {
        try {
            return Promise.allSettled(this.loadQueue)
        } finally {
            // todo
            // this.loadQueue.length = 0
        }
    }

    async loadUrls(urls) {
        return (await Promise.allSettled(urls.map(url => this.load(url)))).map((v) => v.value)
    }

    load(url) {
        if (this.urlMap.has(url)) {
            return Promise.resolve(this.urlMap.get(url))
        }
        const gameImage = new GameImage();
        const image =  platform.createImage();
        gameImage.image = image;

        let success, failure;
        const promise = new Promise((resolve, reject) => {
            success = resolve;
            failure = reject;
        });
        this.loadQueue.push(promise);

        image.src = url
        image.onload = () => {
            gameImage.loadStatus = TEXTURE_LOAD_STATUS.SUCCESS_LOADED
            success(gameImage)
        }
        this.urlMap.set(url, gameImage)
        return promise;
    }

}