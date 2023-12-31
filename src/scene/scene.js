import {glCtx} from "../globalShared";
import {Camera} from "../element";
import {ImageLoader, waitUntil} from "../utils";
import {RenderQueue} from "./renderQueue.js";

export class Scene {
    constructor() {
        this.imageLoader = new ImageLoader()
        this.renderQueue = new RenderQueue()

        this._initializeData()
        this.configureSceneGL()

    }

    _initializeData() {
        this.lightSources = []
        this.gameObjects = []
        this.camera = null;
    }

    /**
     * @public
     */
    init() {
        this.gameObjects = this.layoutScene();
        for (const gameObject of this.gameObjects) {
            gameObject.init()
        }
    }

    drawScene() {
        // this.renderQueue._clearRenderQueue()

        //  calculate perspective matrix
        //  calculate view Matrix
        //  calculate matrix stack hierarchy relationship of parent and children

        // this.imageLoader.isAllLoaded().then(() => {
        //     console.log(this.imageLoader.loadQueue)
            this.clearAndResetScene()
            for (const gameObject of this.gameObjects) {
                gameObject.render(null)
            }
        // }).catch((error) => {
        //     console.log(error)
        // })
    }

    clearAndResetScene() {
        glCtx.clear(glCtx.COLOR_BUFFER_BIT | glCtx.DEPTH_BUFFER_BIT);
    }

    /**
     * maybe have multi camera
     * @param {Camera} camera
     */
    addCamera(camera) {
        this.camera = camera
    }

    addLightSource(lightSource) {
        this.lightSources.push(lightSource)
    }

    /**
     * override by user
     * @virtual
     * @return {GameObject[]} children
     */
    layoutScene() {
    }

    configureSceneGL() {
        // glCtx.enable(glCtx.DEPTH_TEST)
        // glCtx.depthFunc(glCtx.LEQUAL)

        // glCtx.enable(glCtx.BLEND);
        // glCtx.blendFunc(glCtx.SRC_ALPHA, glCtx.ONE_MINUS_SRC_ALPHA); // 设置混合模式

        glCtx.viewport(0, 0, glCtx.canvas.width, glCtx.canvas.height);
        glCtx.pixelStorei(glCtx.UNPACK_FLIP_Y_WEBGL, true);

        //   用于设置清空颜色缓冲区时的清空颜色。它并不会立即执行清空操作，而只是设置一个颜色值
        glCtx.clearColor(.0, .0, .0, .0)
        glCtx.clearDepth(glCtx.DEPTH_CLEAR_VALUE)
    }


}
