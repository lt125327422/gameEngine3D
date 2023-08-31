import {currentScene, glCtx} from "../../globalShared";
import {RenderProgram, Texture} from "../../gl";
import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {mat4, quat, vec3, vec4} from "../../lib";
import {defaultTextureCoords} from "../../gl/texture.js";
import {defaultColor, getNormalizedRGBA} from "../../utils";

export const vertShaderSource = `
    #version 300 es
    precision mediump float;
  
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;

    in vec4 aVertexPosition;
    in vec2 aTextureCoords;
    
    out vec2 vTextureCoords;
    
    void main(){
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition);
        vTextureCoords = aTextureCoords;
    }
`

export const generateFragShader = ({useTexture = false}) => `
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
export const uniformsConfigMap = {
    uQuadColor: {
        type: "uniform4fv",
    },
    uViewMatrix: {
        type: "uniformMatrix4fv",
    },
    uProjectionMatrix: {
        type: "uniformMatrix4fv",
    },
    uModelMatrix: {
        type: "uniformMatrix4fv",
    },
}

export const attributesConfigMap = {
    aVertexPosition: {
        size: 3
    },
    aTextureCoords: {
        size: 2
    },
}


class SpriteConfig extends GameObjectBasicProps {
    constructor() {
        super();
        this.imageSrc = null
        this.color = []
    }
}

export const rectangularIndices = [
    0, 1, 2,
    0, 2, 3
]



export class Sprite extends GameObject {

    /**
     * @param {SpriteConfig} spriteConfig
     */
    constructor(spriteConfig) {
        super(spriteConfig);

        this.spriteConfig = spriteConfig
        this.glData = {}
        this.colorMap = null

        this.spriteConfig.color ??= defaultColor

    }

    async _init() {
        const {spriteConfig: {imageSrc}} = this;

        if (imageSrc) {
            this.colorMap = new Texture(imageSrc, 0);
            await this.colorMap.loadTexture()
            this.isAllAssetsLoaded = true
        }

        this.generateVerticesData({imageRatio:this?.colorMap.imageRatio ?? 1.})

        this.renderProgram = new RenderProgram({
            vertShaderSource,
            fragShaderSource: generateFragShader({useTexture: !!imageSrc}),
            uniformsConfigMap,
            attributesConfigMap,
            glData: this.glData,
            colorMap:this.colorMap
        })

    }

    draw(parent) {
        this._updateData()
        if (!this.isAllAssetsLoaded){
            return
        }
        this.renderProgram.draw()
    }

    generateVerticesData({imageRatio}) {
        const hh =  .5;
        const hw = imageRatio * hh;

        const p0 = vec3.fromValues(-hw, +hh, 0)
        const p1 = vec3.fromValues(hw, hh, 0) //   vec3.add(vec3.create(), p0, [hw, hh, 0])
        const p2 = vec3.fromValues(hw, -hh, 0) //   vec3.subtract(vec3.create(), p1, [-hw, -hh, 0]);
        const p3 = vec3.fromValues(-hw, -hh, 0) //   vec3.subtract(vec3.create(), p0, [hw, -hh, 0])

        this.vertices = [...p0, ...p1, ...p2, ...p3]
    }

    _updateData() {
        this.glData.uProjectionMatrix = currentScene.camera.projectionMatrix
        this.glData.uViewMatrix = currentScene.camera.viewMatrix
        this.glData.uModelMatrix = this.transform.modelMatrix
        this.glData.uQuadColor = this.spriteConfig.color

        //  set ibo and vbo data
        this.glData.indices = rectangularIndices
        this.glData.aVertexPosition = this.vertices
        this.glData.aTextureCoords = defaultTextureCoords
    }

}
