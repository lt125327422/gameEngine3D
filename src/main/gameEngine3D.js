import {GLProgram} from "../gl";
import {setGlCtx} from "../globalShared";

export class GameEngine3D {

    /**
     * @public
     * @param {WebGL2RenderingContext} gl
     * @param {Element} canvas
     */
    constructor({gl, canvas}) {
         this.gl = gl
       this.canvas = canvas

        setGlCtx(gl)
    }

    /**
     * @public
     * @returns {GLProgram}
     */
    createProgram() {
        // return new GLProgram({
        // })
    }

    /**
     * @private
     */
    gameLoop() {

    }
}
