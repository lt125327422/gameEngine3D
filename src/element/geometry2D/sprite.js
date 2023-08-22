import {currentScene, glCtx} from "../../globalShared";
import {RenderProgram, Texture} from "../../gl";
import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {mat4, vec3, vec4} from "../../lib";

const vertShaderSource = `
    #version 300 es
    precision mediump float;
  
   //   uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;

    in vec4 aVertexPosition;
    in vec2 aTextureCoords;
    
    out vec2 vTextureCoords;
    
    void main(){
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(aVertexPosition);
        vTextureCoords = aTextureCoords;
    }
`

const generateFragShader = ({useTexture = false}) => `
    #version 300 es
    precision mediump float;
    
    uniform sampler2D uSampler; 
    uniform vec4 uQuadColor;
    
    in vec2 vTextureCoords;
    
    out vec4 fragColor;
    
    void main(){
       vec4 textureColor;
    
       textureColor = ${useTexture ? `texture(uSampler, vTextureCoords)` : `uQuadColor`};

       fragColor = textureColor;
    }
`

/**
 * @type {{[prop:string]: UniformDesc}}
 */
const uniformsConfigMap = {
    uQuadColor: {
        type: "uniform4fv",
    },
    uViewMatrix: {
        type: "uniformMatrix4fv",
    },
    uProjectionMatrix: {
        type: "uniformMatrix4fv",
    },
    // uSampler: {
    //     type: "uniform1i",
    // },
}

const attributesConfigMap = {
    aVertexPosition: {
        size: 3
    },
    aTextureCoords: {
        size: 2
    },
    // indices: {
    //     size: 3 ???
    // },
}

/**
 * @public
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @return {Float32List}
 */
const getNormalizedRGBA = (r, g, b, a = 1.) => {
    const color = vec3.fromValues(r, g, b);
    vec3.normalize(color, color)
    return vec4.fromValues(...color, a)
}

class SpriteConfig extends GameObjectBasicProps {
    constructor() {
        super();
        this.imageSrc = null
        this.color = []
    }
}

const indices = [
    0, 1, 2,
    0, 2, 3
]

const defaultTextureCoords = [
    0, 1,
    1, 1,
    1, 0,
    0, 0,
]

const defaultColor = getNormalizedRGBA(27, 195, 162)

export class Sprite extends GameObject {

    /**
     * @param {SpriteConfig} spriteConfig
     */
    constructor(spriteConfig) {
        super(spriteConfig);

        this.spriteConfig = spriteConfig
        this.glData = {}

        this.spriteConfig.color ??= defaultColor
    }

    async _init() {
        const {spriteConfig: {imageSrc}} = this;

        this._generateAttrData()

        let colorMap
        if (imageSrc) {
            colorMap = new Texture(imageSrc, 0);
            await colorMap.loadTexture()
        }

        this.renderProgram = new RenderProgram({
            vertShaderSource,
            fragShaderSource: generateFragShader({useTexture: !!imageSrc}),
            uniformsConfigMap,
            attributesConfigMap,
            glData: this.glData,
            colorMap
        })
    }

    _generateAttrData() {
        const {spriteConfig: {w, h}} = this;
        const hw = w / 2;
        const hh = h / 2;

        const p0 = vec3.fromValues(-hw, +hh, 0)
        const p1 = vec3.add(vec3.create(), p0, [w, 0, 0])
        const p3 = vec3.subtract(vec3.create(), p0, [0, h, 0])
        const p2 = vec3.subtract(vec3.create(), p1, [0, h, 0]);

        this.vertices = [...p0, ...p1, ...p2, ...p3]
    }

    _setData() {
        currentScene.camera.update()

        //  set uniform data
        this.glData.uProjectionMatrix = currentScene.camera.projectionMatrix
        this.glData.uViewMatrix = currentScene.camera.viewMatrix

        this.glData.uQuadColor = this.spriteConfig.color

        //  set ibo and vbo data
        this.glData.indices = indices
        this.glData.aVertexPosition = this.vertices
        this.glData.aTextureCoords = defaultTextureCoords
    }

    getModelMatrix() {

    }

    render(parent) {
        this._setData()
        this.renderProgram.draw()

        // for (const child of this.children) {
        //     child.render(this)
        // }
    }

}
