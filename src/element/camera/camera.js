import {mat4, vec3, vec4,GUI} from "../../lib";
import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {currentScene, glCtx} from "../../globalShared";

class CameraConfig extends GameObjectBasicProps {
    constructor() {
        super();
    }
}

const zAxisIdx = 2

export class Camera extends GameObject {

    constructor(cameraConfig={}) {
        super(cameraConfig);
        this.cameraConfig = cameraConfig

        // this.eyesPos = vec3.fromValues(0, 0, 0)
        // this.focusPos = vec3.fromValues(0, 0, 1)
        // this.upDir = vec3.fromValues(0, 1, 0)

        this.cameraMatrix = mat4.create()
        this.viewMatrix = mat4.create()
        this.projectionMatrix = mat4.create()

        this.cameraPosition = vec3.create()

        this.horizonRotate = 0
        this.verticalRotate = 0
    }

    _init() {
        const {canvas: {height, width}} = glCtx;

       this._initCamera()

        // mat4.orthoNO(this.projectionMatrix,-1,1,-1,1,-1,1)
        mat4.perspectiveNO(this.projectionMatrix,45, width / height,.1, 10000);
        currentScene.addCamera(this)
        this._initControls()
    }

    _initCamera() {
        this.cameraPosition[zAxisIdx] = 2;
        this.update()
    }

    update() {
        mat4.identity(this.cameraMatrix)
        mat4.translate(this.cameraMatrix,this.cameraMatrix,this.cameraPosition)

        mat4.rotateY(this.cameraMatrix,this.cameraMatrix,this.horizonRotate)
        mat4.rotateX(this.cameraMatrix,this.cameraMatrix,this.verticalRotate)
        mat4.invert(this.viewMatrix ,this.cameraMatrix)
    }

    _initControls() {
        const offset = .03

        // glCtx.canvas.addEventListener("mousemove", (evt) => {
        //     if (this.pressed === 0) {
        //         const {movementX,movementY} = evt;
        //         this.horizonRotate += movementX *.01
        //         this.verticalRotate += movementY *.01
        //
        //     }
        // })
        //
        // glCtx.canvas.addEventListener("mousedown", (evt) => {
        //     const {button} = evt;
        //     if (button === 0) {
        //         this.pressed = button
        //     }
        // })
        // glCtx.canvas.addEventListener("mouseup", (evt) => {
        //     const {button} = evt;
        //     if (button === 0) {
        //         this.pressed = -1
        //     }
        // })
        // glCtx.canvas.addEventListener("mouseleave", (evt) => {
        //     this.pressed = -1
        // })
        //
        // const gui = new GUI();
        // gui.add(this.cameraPosition,"0",-3,3).name("camera x")
        // gui.add(this.cameraPosition,"1",-3,3).name("camera y")
        // gui.add(this.cameraPosition,"2",-3,3).name("camera z").setValue(1.)

        glCtx.canvas.addEventListener("wheel", (evt) => {
            if (evt.deltaY > 0) {     //  shrink
                this.cameraPosition[zAxisIdx] += offset
            } else {   //  magnify
                if (this.cameraPosition[zAxisIdx] - offset < .1){
                    return
                }
                this.cameraPosition[zAxisIdx] -= offset
            }
            this.update()
        })

        glCtx.canvas.addEventListener("mousedown", (evt) => {
            const {button} = evt;
            if (button === 0) {
                this.pressed = button
            }
        })

        glCtx.canvas.addEventListener("mouseup", (evt) => {
            const {button} = evt;
            if (button === 0) {
                this.pressed = -1
            }
        })

        glCtx.canvas.addEventListener("mouseleave", (evt) => {
                this.pressed = -1
        })

        glCtx.canvas.addEventListener("mousemove", (evt) => {
            if (this.pressed === 0) {
                this.cameraPosition[0] += evt.movementX * .001 * this.cameraPosition[zAxisIdx] * -1
                this.cameraPosition[1] += evt.movementY * .001 * this.cameraPosition[zAxisIdx]
                this.update()
            }
        })

    }

    draw(parent) {
        //  do nothing
    }

    getViewMatrix() {
        // return mat4.invert(this.viewMatrix, this.cameraMatrix)
    }

    setProjection(vec4) {

    }

    setCameraPosition(vec3) {
        this.cameraPosition = vec3
    }

    setCameraRotation(vec3) {
        this.cameraRotation = vec3
    }


}
