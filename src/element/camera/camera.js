import {mat4, vec3, vec4,GUI} from "../../lib";
import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {currentScene, glCtx} from "../../globalShared";

class CameraConfig extends GameObjectBasicProps {
    constructor() {
        super();
    }
}

export class Camera extends GameObject {

    constructor(cameraConfig) {
        super(cameraConfig);

        this.cameraConfig = cameraConfig

        this.eyesPos = vec3.fromValues(0, 0, 1)
        this.focusPos = vec3.fromValues(0, 0, -1)
        this.upDir = vec3.fromValues(0, 1, 0)

        this.viewMatrix = mat4.create()
    }

    _init() {
        const {canvas: {height, width}} = glCtx;

        this.horizonRotate = 0
        this.verticalRotate = 0
        this.cameraMatrix = mat4.create()

        // mat4.translate(this.cameraMatrix,this.cameraMatrix,vec3.fromValues(0,0,5))
        // mat4.invert(this.viewMatrix,this.cameraMatrix)
        // this.viewMatrix = mat4.invert(mat4.create(),this.cameraMatrix)

        // this.viewMatrix = mat4.lookAt(this.viewMatrix, this.eyesPos, this.focusPos, this.upDir)
        this.cameraPosition = vec3.create()

        this.update()

        this.projectionMatrix = mat4.perspective(mat4.create(),
            30, width / height,
            .1, 10000);

        // this.cameraPosition = vec3.create()
        // this.cameraRotation = vec3.create()
        // this.cameraScale = vec3.fromValues(1,1,1)

        currentScene.addCamera(this)

        this._initControls()
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
        const zAxis = 2

        glCtx.canvas.addEventListener("mousemove", (evt) => {
            if (this.pressed === 0) {
                const {movementX,movementY} = evt;
                this.horizonRotate += movementX *.01
                this.verticalRotate += movementY *.01

            }
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

        const gui = new GUI();
        gui.add(this.cameraPosition,"0",-3,3).name("camera x")
        gui.add(this.cameraPosition,"1",-3,3).name("camera y")
        gui.add(this.cameraPosition,"2",-3,3).name("camera z").setValue(1.)



        // glCtx.canvas.addEventListener("wheel", (evt) => {
        //     if (evt.deltaY > 0) {
        //         //  shrink
        //         this.eyesPos[zAxis] += offset
        //     } else {
        //         //  magnify
        //         this.eyesPos[zAxis] -= offset
        //     }
        // })
        //
        // glCtx.canvas.addEventListener("mousedown", (evt) => {
        //     const {button} = evt;
        //     if (button === 0) {
        //         this.pressed = button
        //     }
        // })
        //
        // glCtx.canvas.addEventListener("mouseup", (evt) => {
        //     const {button} = evt;
        //     if (button === 0) {
        //         this.pressed = -1
        //     }
        // })
        //
        // glCtx.canvas.addEventListener("mouseleave", (evt) => {
        //         this.pressed = -1
        // })
        //
        // glCtx.canvas.addEventListener("mousemove", (evt) => {
        //     if (this.pressed === 0) {
        //         this.eyesPos[0] += evt.movementX * .001 * this.eyesPos[2]
        //         this.eyesPos[1] += evt.movementY * .001 * this.eyesPos[2] * -1
        //
        //         this.focusPos[0] += evt.movementX * .001 * this.eyesPos[2]
        //         this.focusPos[1] += evt.movementY * .001 * this.eyesPos[2] * -1
        //         // console.log(evt.movementX, evt.movementY)
        //     }
        // })
    }

    render(parent) {
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

    setCameraScale(vec3) {
        this.cameraScale = vec3
    }


}
