import {glCtx} from "../globalShared";
import {mat4} from "../lib";
import {Camera} from "./camera.js";

export class Scene {
    constructor() {
        this.camera = new Camera()
    }

    _init(){
        this.gameObjects = this.createScene();

        for (const gameObject of this.gameObjects) {
            gameObject._init()
        }

    }

    /**
     *
     * @param {Transform} transform
     */
    setCamera(transform){
        //  change view matrix
    }

    //  light source

    /**
     * @virtual
     * @return {GameObject[]} children
     */
    createScene(){
    }

    drawScene(){
        this.clearSceneDraw()
        for (const gameObject of this.gameObjects) {
            gameObject.render()
        }
    }

    clearSceneDraw() {
        glCtx.pixelStorei(glCtx.UNPACK_FLIP_Y_WEBGL, true);

        // console.log( glCtx.canvas.width)
        glCtx.viewport(0, 0, glCtx.canvas.width, glCtx.canvas.height);
        glCtx.clear(glCtx.COLOR_BUFFER_BIT | glCtx.DEPTH_BUFFER_BIT);

        //   用于设置清空颜色缓冲区时的清空颜色。它并不会立即执行清空操作，而只是设置一个颜色值
        // glCtx.clearColor(.9,.9,.9,1)
        // glCtx.clearDepth(glCtx.DEPTH_CLEAR_VALUE)

        console.log(glCtx.DEPTH_CLEAR_VALUE)
        glCtx.enable(glCtx.DEPTH_TEST)
        glCtx.depthFunc(glCtx.LEQUAL)
    }
}
