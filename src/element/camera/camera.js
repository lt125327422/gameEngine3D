import {mat4,vec3} from "../../lib";
import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {currentScene, glCtx} from "../../globalShared";

class CameraConfig extends GameObjectBasicProps {
    constructor() {
        super();
    }
}

export class Camera extends GameObject{

    constructor(cameraConfig) {
        super(cameraConfig);

        this.cameraConfig = cameraConfig
    }

    _init() {
        const {canvas: {height, width}} = glCtx;

        this.cameraMatrix = mat4.create()

        this.viewMatrix = mat4.invert(mat4.create(),this.cameraMatrix)

        this.projectionMatrix = mat4.perspective(mat4.create(),
            30, width / height,
            .1, 10000);

        this.cameraPosition = vec3.create()
        this.cameraRotation = vec3.create()
        this.cameraScale = vec3.fromValues(1,1,1)

        currentScene.addCamera(this)
    }

    render(parent) {
        //  do nothing
    }

    getViewMatrix() {
        return mat4.invert(this.viewMatrix, this.cameraMatrix)
    }

    setProjection(vec4){

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
