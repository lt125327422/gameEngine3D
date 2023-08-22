import {currentScene, glCtx} from "../globalShared";

class UniformDesc {
    /**
     * @param {string} type
     * @param {any} data
     */
    constructor({type, data}) {
        this.type = type
        this.data = data
    }
}

export class RenderProgram {

    /**
     * @public
     * @param {string} fragShaderSource
     * @param {string} vertShaderSource
     * @param uniformsConfigMap
     * @param attributesConfigMap
     * @param glData
     * @param {Texture} colorMap
     */
    constructor({
                    fragShaderSource, vertShaderSource,
                    uniformsConfigMap, attributesConfigMap,
                    glData,
                    colorMap
                }) {
        this.gl = glCtx

        this.uniformsConfigMap = uniformsConfigMap
        this.attributesConfigMap = attributesConfigMap
        this.glData = glData
        this.vboMap = {}

        this.colorMap = colorMap

        this._initProgram(vertShaderSource, fragShaderSource)

        this.useProgram()

        this.initParameterLocationOfShader()
        this.createBuffers()
    }

    createBuffers(){
        this.vao = glCtx.createVertexArray()

        this.ibo = glCtx.createBuffer();

        for (const vboKey of Object.keys(this.attributesConfigMap)) {
           this.vboMap[vboKey] = glCtx.createBuffer()
        }
    }

    /**
     * @public
     */
    useProgram() {
        this.gl.useProgram(this.webGLProgram)
    }

    /**
     * @param {GLenum} drawType
     */
    draw({drawType} = {}) {
        drawType ??= glCtx.TRIANGLES

        // currentScene.renderQueue._addToRenderQueue()   //  render weight

        this.useProgram()

        this.getUniforms()

        this.getRenderDataOfShader()

        this.colorMap?.active(this.webGLProgram)

        glCtx.bindVertexArray(this.vao);
        glCtx.drawElements(drawType, this.glData.indices.length, glCtx.UNSIGNED_SHORT, 0)
        glCtx.bindVertexArray(null);
    }

    getUniforms() {
        for (const [uniformKey, {type}] of Object.entries(this.uniformsConfigMap)) {
            const data = this.glData[uniformKey];
            const location = this.uniforms[uniformKey];
            if (/Matrix\d.v$/.test(type)) {
                glCtx.uniformMatrix4fv(location, false, data)
            } else {
                ;(glCtx[type])(location, data,)
            }
            //   glCtx.uniform1i  glCtx.uniform4fv
        }
    }

    getRenderDataOfShader() {
        glCtx.bindVertexArray(this.vao)

        glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, this.ibo)
        glCtx.bufferData(glCtx.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.glData["indices"]), glCtx.STATIC_DRAW)

        for (const [vboKey, {size = 3}] of Object.entries(this.attributesConfigMap)) {
            const vbo = this.vboMap[vboKey]
            glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vbo)

            const glDatum = this.glData[vboKey];

            glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(glDatum), glCtx.STATIC_DRAW)
            glCtx.enableVertexAttribArray(this.attributes[vboKey])
            glCtx.vertexAttribPointer(this.attributes[vboKey], size, glCtx.FLOAT, false, 0, 0)
        }

        // const textureConfigMap = {}
        //  bind normal
        //  bind vertex color

        glCtx.bindVertexArray(null)
        glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, null)
        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, null)

    }

    initParameterLocationOfShader() {
        this.attributes = {}
        this.uniforms = {}
        for (const uniform of Object.keys(this.uniformsConfigMap)) {
            this.uniforms[uniform] = this.gl.getUniformLocation(this.webGLProgram, uniform)
        }
        for (const attr of Object.keys(this.attributesConfigMap)) {
            this.attributes[attr] = this.gl.getAttribLocation(this.webGLProgram, attr)
        }
    }

    /**
     * @public
     */
    getUniformByLocation(uniformLocation) {
        return this.gl.getUniform(this.webGLProgram, uniformLocation)
    }

    /**
     * @private
     * @param vertShaderSource
     * @param fragShaderSource
     */
    _initProgram(vertShaderSource, fragShaderSource) {
        this.webGLProgram = this.gl.createProgram();

        const vss = vertShaderSource
        const fss = fragShaderSource
        this.gl.attachShader(this.webGLProgram, this._initShader(vss, this.gl.VERTEX_SHADER))
        this.gl.attachShader(this.webGLProgram, this._initShader(fss, this.gl.FRAGMENT_SHADER))
        this.gl.linkProgram(this.webGLProgram)

        if (!this.gl.getProgramParameter(this.webGLProgram, this.gl.LINK_STATUS)) {
            console.log(this.gl.getProgramInfoLog(this.webGLProgram))
        }
    }

    /**
     * @private
     * @param  {string} shaderSource
     * @param  {GLenum} shaderType
     */
    _initShader(shaderSource, shaderType) {
        shaderSource = shaderSource.trim()
        const shader = this.gl.createShader(shaderType);

        this.gl.shaderSource(shader, shaderSource)
        this.gl.compileShader(shader)
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log(this.gl.getShaderInfoLog(shader))
        }
        return shader
    }
}
