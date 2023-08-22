import {currentScene, glCtx} from "../globalShared";

export class Texture {
    constructor(imageSrc,textureNo,uSampler) {
        this.imageSrc = imageSrc
        this.textureNo = textureNo
        this.uSampler = uSampler
    }

    async loadTexture() {
        const gl = glCtx

        const {image} = await currentScene.imageLoader.load(this.imageSrc)
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    active(program) {
        const {textureNo} = this
        const tno = `TEXTURE${textureNo}`
        const _tno = glCtx[tno];

        glCtx.activeTexture(_tno)
        glCtx.bindTexture(glCtx.TEXTURE_2D, this.texture)

        let textureLocation = glCtx.getUniformLocation(program,"uSampler");
        glCtx.uniform1i(textureLocation,textureNo)
    }
}