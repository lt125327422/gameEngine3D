import {glCtx} from "../../globalShared";
import {GLProgram} from "../../gl";
import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {mat4, vec2, vec3, vec4} from "../../lib";


const vertShaderSource = `
    #version 300 es
    precision mediump float;
  
   //   uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    in vec4 aVertexPosition;
    in vec2 aTextureCoords;
    
    out vec2 vTextureCoords;
    
    void main(){
        gl_Position = uProjectionMatrix * vec4(aVertexPosition);
        vTextureCoords = aTextureCoords;
    }
`


const generateFragShader = ({useTexture = false}) => `
    #version 300 es
    precision mediump float;
    
    #define USE_TEXTURE
    
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

const uniforms = [
        "uQuadColor",
        // "uModelViewMatrix",
        "uProjectionMatrix",
        "uSampler",
    ],
    attributes = [
        "aVertexPosition",
        "aTextureCoords",
    ]


class SpriteConfig extends GameObjectBasicProps {
    constructor() {
        super();
        this.imageSrc = null
    }
}

export class Sprite extends GameObject {

    /**
     * @param {SpriteConfig} spriteConfig
     */
    constructor(spriteConfig) {

        super(spriteConfig);

        this.spriteConfig = spriteConfig

    }

    _init() {
        const {spriteConfig: {imageSrc}} = this;
        //  load image
        this.glProgram = new GLProgram({
            vertShaderSource,
            fragShaderSource:
                generateFragShader({useTexture: imageSrc}),
            uniforms,
            attributes
        })

        this.generateDataByUserInput()
        this.setRenderData()
    }

    generateDataByUserInput() {
        const {spriteConfig: {w, h}} = this;

        const hw = w / 2;
        const hh = h / 2;

        /**
         * @readonly
         * @type {vec2}
         */
        const p0 = vec2.fromValues(-hw, +hh)
        const p1 = vec2.add(vec2.create(), p0, [w, 0])
        const p3 = vec2.subtract(vec2.create(), p0, [0, h])
        const p2 = vec2.subtract(vec2.create(), p1, [0, h])

        // this.vertices = [...p0, ...p1, ...p2, ...p3]
        this.vertices = [
            -0.5, 0.5, -1,
            0.5, 0.5, -1,
            0.5, -0.5, -1,
            -0.5, -0.5, -1,
        ]

        // this.indices = [
        //     0, 1, 2,
        //     0, 3, 2
        // ]

        this.indices = [
            0, 1, 2,
            0, 2, 3
        ]

        this.textureCoords = [
            0, 1,
            1, 1,
            1, 0,
            0, 0,
        ]
    }


    render() {
        this.glProgram.useProgram()

        glCtx.bindVertexArray(this.vao);

        const {canvas: {height, width}} = glCtx;

        const projection = mat4.perspective(mat4.create(),
            45, width / height,
            .1, 10000);

        glCtx.uniformMatrix4fv(this.glProgram.uniforms.uProjectionMatrix,
            false,
            projection
        );

        const getNormalizedRGBA = (r, g, b, a = 1.) => {
            const color = vec3.fromValues(r, g, b);
            vec3.normalize(color, color)
            return vec4.fromValues(...color, a)
        }

        glCtx.uniform4fv(
            this.glProgram.uniforms.uQuadColor,
            getNormalizedRGBA(27, 195, 162)
        );


        setTimeout(()=>{
            glCtx.activeTexture(glCtx.TEXTURE0)
            glCtx.bindTexture(glCtx.TEXTURE_2D,this.texture)
            glCtx.uniform1i(this.glProgram.uniforms.uSampler,0)

            glCtx.drawElements(glCtx.TRIANGLES, this.indices.length,
                glCtx.UNSIGNED_SHORT, 0)

            glCtx.bindVertexArray(null);
        },1000)
    }

    setRenderData() {
        //  useProgram

        this.vao = glCtx.createVertexArray()
        glCtx.bindVertexArray(this.vao)

        this.ibo = glCtx.createBuffer();
        glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, this.ibo)
        glCtx.bufferData(glCtx.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            glCtx.STATIC_DRAW
        )

        this.vbo = glCtx.createBuffer()
        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, this.vbo)
        glCtx.bufferData(glCtx.ARRAY_BUFFER,
            new Float32Array(this.vertices),
            glCtx.STATIC_DRAW
        )
        glCtx.enableVertexAttribArray(this.glProgram.attributes.aVertexPosition)
        glCtx.vertexAttribPointer(this.glProgram.attributes.aVertexPosition,
            3, glCtx.FLOAT, false, 0, 0
        )




        //  bind normal

        //  bind vertex color

        //  bind texture coordinate

        //  bind texture

        this.uv = glCtx.createBuffer()
        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, this.uv)
        glCtx.bufferData(glCtx.ARRAY_BUFFER,
            new Float32Array(this.textureCoords),
            glCtx.STATIC_DRAW
        )
        glCtx.enableVertexAttribArray(this.glProgram.attributes.aTextureCoords)
        glCtx.vertexAttribPointer(this.glProgram.attributes.aTextureCoords,
            2, glCtx.FLOAT, false, 0, 0
        )

        const {spriteConfig: {imageSrc}} = this;
        if (imageSrc){
            const image = new Image();
            image.src = imageSrc
            new Promise((resolve)=>{
                image.onload = resolve
            }).then(()=>{
                const gl = glCtx
                this.texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, image);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
            })
        }

        glCtx.bindVertexArray(null)
        glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, null)
        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, null)
    }
}
