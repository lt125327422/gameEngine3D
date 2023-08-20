import {glCtx} from "../globalShared";

export class GLProgram {

    /**
     * @public
     * @param {string} fragShaderSource
     * @param {string} vertShaderSource
     * @param {string []} attributes
     * @param {string []} uniforms
     */
    constructor({
                    fragShaderSource, vertShaderSource,
                    attributes, uniforms
                }) {
        this.gl = glCtx

        this.initProgram(vertShaderSource, fragShaderSource)
        this.initParameterLocationOfShader(
            {attributes, uniforms}
        )
    }

    /**
     * @public
     */
    getUniformByLocation(uniformLocation) {
        return this.gl.getUniform(this.webGLProgram, uniformLocation)
    }

    /**
     * @public
     */
    useProgram() {
        this.gl.useProgram(this.webGLProgram)
    }

    /**
     * @private
     * @param  {string} shaderSource
     * @param  {GLenum} shaderType
     */
    initShader(shaderSource, shaderType) {

        shaderSource = shaderSource.trim()
        const shader = this.gl.createShader(shaderType);

        this.gl.shaderSource(shader, shaderSource)
        this.gl.compileShader(shader)
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log(this.gl.getShaderInfoLog(shader))
        }
        return shader
    }

    /**
     * @private
     * @param attributes
     * @param uniforms
     */
    initParameterLocationOfShader({attributes, uniforms} = {}) {
        this.useProgram()

        this.attributes = {}
        this.uniforms = {}

        for (const attribute of attributes) {

            this.attributes[attribute] =
                this.gl.getAttribLocation(this.webGLProgram, attribute)
        }
        for (const uniform of uniforms) {
            this.uniforms[uniform] =
                this.gl.getUniformLocation(this.webGLProgram, uniform)
        }
    }

    /**
     * @private
     * @param vertShaderSource
     * @param fragShaderSource
     */
    initProgram(vertShaderSource, fragShaderSource) {
        this.webGLProgram = this.gl.createProgram();

        const vss = vertShaderSource
        const fss = fragShaderSource
        this.gl.attachShader(this.webGLProgram, this.initShader(vss,
            this.gl.VERTEX_SHADER))
        this.gl.attachShader(this.webGLProgram, this.initShader(fss,
            this.gl.FRAGMENT_SHADER))
        this.gl.linkProgram(this.webGLProgram)

        if (!this.gl.getProgramParameter(this.webGLProgram, this.gl.LINK_STATUS)) {
            console.log(this.gl.getProgramInfoLog(this.webGLProgram))
        }
    }
}
