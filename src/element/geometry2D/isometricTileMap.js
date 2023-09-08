import {GameObject, GameObjectBasicProps} from "../gameObject.js";
import {currentScene, glCtx} from "../../globalShared";
import {RenderProgram, Texture} from "../../gl";
import {
    attributesConfigMap,
    generateFragShader,
    rectangularIndices,
    uniformsConfigMap,
    vertShaderSource
} from "./sprite.js";
import {vec3} from "../../lib";
import {defaultColor, noop, waitUntil} from "../../utils";
import {defaultTextureCoords} from "../../gl/texture.js";
import {RayCast} from "../../scene/RayCast.js";

class IsometricTileMapConfig extends GameObjectBasicProps {
    constructor() {
        super();
        this.imgUrlList = []
        this.tileMapMatrix = []
    }
}

class RenderTile {
    constructor() {
        this.coord = []
        this.type = 0

        this.texture = null
    }

}

const defaultIsometricTextureCoords = [
    .5, .5,
    1, .5,
    .5, 0,
    0, .5,
]

class BatchedTiles extends GameObject {
    constructor({texture} = {}) {
        super();
        this.vertices = []
        this.indices = []

        this.texture = texture
        this.glData = {}

        this._init()
    }

    addTile(vertices, indices) {
        this.vertices.push(...vertices)
        this.indices.push(...indices)
    }

    _updateData() {
        this.glData.uProjectionMatrix = currentScene.camera.projectionMatrix
        this.glData.uViewMatrix = currentScene.camera.viewMatrix
        this.glData.uModelMatrix = this.transform.modelMatrix

        this.glData.uQuadColor = defaultColor

        //  set ibo and vbo data
        this.glData.indices = this.indices
        this.glData.aVertexPosition = this.vertices

        const stCount = (this.vertices.length / 3.) / 4.
        this.glData.aTextureCoords = Array.from({length: stCount}).flatMap(() => defaultTextureCoords)
    }

    _init() {
        this.renderProgram = new RenderProgram({
            vertShaderSource,
            fragShaderSource: generateFragShader({useTexture: true}),
            uniformsConfigMap,
            attributesConfigMap,
            glData: this.glData,
            colorMap: this.texture
        })
    }

    draw(parent) {
        this._updateData()
        if (this.indices.length < 0) {
            return
        }
        // glCtx.disable(glCtx.DEPTH_TEST)
        // glCtx.enable(glCtx.DEPTH_TEST)
        // glCtx.depthFunc(glCtx.LEQUAL)

        glCtx.enable(glCtx.BLEND);
        glCtx.blendFunc(glCtx.SRC_ALPHA, glCtx.ONE_MINUS_SRC_ALPHA); // 设置混合模式
        this.renderProgram.draw()
        glCtx.disable(glCtx.BLEND);
    }
}


export class IsometricTileMap extends GameObject {

    /**
     * @param {IsometricTileMapConfig} isometricTileMapConfig
     */
    constructor(isometricTileMapConfig) {
        super(isometricTileMapConfig);

        this.isometricTileMapConfig = isometricTileMapConfig
        this.glData = {}

        /**
         * @type {Map<number, BatchedTiles>}
         */
        this.batchedMap = new Map();

    }

    draw(parent) {

        for (const [_, batchedMapElement] of this.batchedMap) {
            batchedMapElement._updateData()
        }

    }

    /**
     * @private
     * @param generatedTileIdx
     * @return {number[]}
     */
    generateIndices(generatedTileIdx) {
        const offset = generatedTileIdx * 4;
        return rectangularIndices.map(v => v + offset)
    }

    /**
     * @private
     * @param cx
     * @param cy
     * @return {number[]}
     */
    generateTileVerticesByCenterCoord(cx, cy) {
        // console.log(cx, cy)
        const hw = .5;
        const hh = .25;

        const p0 = vec3.fromValues(cx - hw, cy + hh, 0)
        const p1 = vec3.fromValues(cx + hw, cy + hh, 0)
        const p2 = vec3.fromValues(cx + hw, cy - hh, 0)
        const p3 = vec3.fromValues(cx - hw, cy - hh, 0)

        // console.log(p0,p1,p2,p3)
        return [...p0, ...p1, ...p2, ...p3]
    }

    async prepareData() {
        //  prepare data
        const {tileMapMatrix, imgUrlList} = this.isometricTileMapConfig;
        const {length: imageTypeCount} = imgUrlList;

        let count = 0
        this.colorMapList = imgUrlList.map((imageSrc) => {
            const colorMap = new Texture(imageSrc)
            colorMap.loadTexture().then(() => {
                if (++count === imageTypeCount) {
                    this.isAllAssetsLoaded = true
                }
            })
            return colorMap
        })

        // await currentScene.imageLoader.isAllLoaded()
        await waitUntil(() => this.isAllAssetsLoaded === true)

        for (let type = 0; type < imageTypeCount; type++) {
            this.batchedMap.set(type, new BatchedTiles({
                texture: this.colorMapList[type]
            }))
        }

        // for (let [y, row] of Object.entries(tileMapMatrix)) {
        for (let y = tileMapMatrix.length - 1; y > -1; y--) {
            const row = tileMapMatrix[y]
            for (let x = row.length - 1; x > -1; x--) {
                const type = row[x]
                // for (let [x, type] of Object.entries(row)) {
                y = +y
                x = +x
                if (type === -1) {
                    continue;
                }
                const batch = this.batchedMap.get(type);

                const _x = (x - y) * .5
                const _y = (x + y) * .25
                // console.log(_x, _y)
                const perRectangularOffset = batch.indices.length / 6;
                batch.addTile(
                    this.generateTileVerticesByCenterCoord(_x, _y),
                    this.generateIndices(perRectangularOffset)
                )
            }
        }


        this.children = [...this.batchedMap.values()]
    }

    async _init() {
        return this.prepareData()
    }

}