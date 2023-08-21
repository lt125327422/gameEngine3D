/**
 * @abstract
 */
export class AbstractApi {

    /**
     * @virtual
     */
    getCanvasBoundingClientRect() {
    }

    /**
     * @virtual
     */
    getDPR() {
    }

    /**
     * @virtual
     */
    createImage() {
    }

    /**
     * @virtual
     */
    requestAnimationFrame(callback) {
    }
}