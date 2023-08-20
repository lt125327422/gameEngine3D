import {mat4,vec3} from "../lib";

export class Camera {

    constructor() {
        this.cameraMatrix = mat4.create()
        this.viewMatrix = this.cameraMatrix

        this.projectionMatrix = mat4.perspective(mat4.create(),
            30,2,1,100
        )

        this.cameraPosition = vec3.create()
        this.cameraRotation = vec3.create()
        this.cameraScale = vec3.fromValues(1,1,1)
    }

    getViewMatrix() {
        return mat4.invert(this.viewMatrix, this.cameraMatrix)
    }

    setProjection(vec4){

    }

    setCameraPosition(vec3) {
        // mat4.identity(this.cameraMatrix)
        this.cameraPosition = vec3
    }

    setCameraRotation(vec3) {
        this.cameraRotation = vec3
    }

    setCameraScale(vec3) {
        this.cameraScale = vec3
    }
}
