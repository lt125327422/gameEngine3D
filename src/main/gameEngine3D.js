import {currentScene, setCurrentScene, setGlCtx} from "../globalShared";
import {nextFrame} from "../utils";
import {platform, setupPlatform} from "../plantform";

export class GameEngine3D {

    /**
     * @public
     * @param {WebGL2RenderingContext} gl
     * @param {Element} canvas
     * @param {[]} scenes
     */
    constructor({gl, canvas, scenes}) {
        this.canvas = canvas
        this.scenes = scenes
        this.sceneMap = new Map()

        setGlCtx(gl)
        setupPlatform({canvasEl: canvas})

        this.setDprAdapt()
    }

    setDprAdapt() {
        const {width, height} = platform.getBoundingClientRect();
        const dpr = platform.getDPR();
        this.canvas.width = dpr * width
        this.canvas.height = dpr * height
    }

    start() {
        this.initFirstScene()
        this.gameLoop().then(() => {
        })
    }

    /**
     * @private
     */
    async gameLoop() {

        while (1) {

            //  wait until isStopping !== true
            currentScene.drawScene()

            return
            await nextFrame()
        }
    }

    initFirstScene() {
        const [FirstScene] = this.scenes;
        const firstScene = new FirstScene();
        this.sceneMap.set(FirstScene, firstScene)
        setCurrentScene(firstScene)

        firstScene.init()
    }

    switchScene(){}
}
