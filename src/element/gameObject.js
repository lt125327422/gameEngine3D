import {currentScene} from "../globalShared";
import {mat4, quat, vec3} from "../lib";
import {noop} from "../utils";

class Transform {
    constructor() {
        this.x = 0
        this.y = 0
        this.z = 0
        this.scaleX = 1
        this.scaleY = 1
        this.scaleZ = 1
        this.rotateX = 0
        this.rotateY = 0
        this.rotateZ = 0

        const {
            rotateX, rotateY, rotateZ,
            scaleX, scaleY, scaleZ,
            x, y, z
        } = this;
        this.translateVec3 = vec3.fromValues(x, y, z)
        this.scaleVec3 = vec3.fromValues(scaleX, scaleY, scaleZ)
        this.rotateQuat = quat.fromEuler(quat.create(), rotateZ, rotateY, rotateX)
        this.modelMatrix = mat4.create();
    }

    updateModelMatrix() {
        const {
            rotateX, rotateY, rotateZ,
            scaleX, scaleY, scaleZ,
            x, y, z
        } = this;
        vec3.set(this.translateVec3, x, y, z)
        vec3.set(this.scaleVec3, scaleX, scaleY, scaleZ)
        quat.fromEuler(this.rotateQuat, rotateZ, rotateY, rotateX)
        mat4.fromRotationTranslationScale(this.modelMatrix,
            this.rotateQuat,
            this.translateVec3,
            this.scaleVec3,
        )
    }
}

export class GameObjectBasicProps {
    constructor() {
        /**
         * @type {GameObject[]}
         */
        this.children = []
        this.setup = noop
    }
}

export class GameObject {

    /**
     * @param {GameObjectBasicProps} config
     */
    constructor(config={}) {
        this.config = config

        /**
         * @type {Transform}
         */
        this.transform = new Transform()
        this.children = config.children ?? []

        this.components = []
        this.parent = null
        this.isAllAssetsLoaded = false;

    }

    getComponents(type) {
        return this.components.filter(comp => comp instanceof type)
    }

    async init() {
        await this._init()
        this.config.setup?.()
        for (const child of this.children) {
            await child.init()
        }
    }

    /**
     * @virtual
     * @public
     * @return void
     */
    async _init() {
    }

    render(parent) {
        this.transform.updateModelMatrix()
        this.parent = parent

        this.draw(parent)

        // console.log( this,this.children)
        //  todo add to render pipeline , and sort that
        for (const child of this.children) {
            child.render(this)
        }
    }

    /**
     * @virtual
     * @return void
     */
    draw(parent) {
    }

}
