import {GameObject, GameObjectBasicProps} from "../gameObject.js";

class IsometricTileMapConfig extends GameObjectBasicProps {
    constructor() {
        super();
        this.imageSrc = null
    }
}

class IsometricTileMap extends GameObject{

    /**
     * @param {IsometricTileMapConfig} isometricTileMapConfig
     */
    constructor(isometricTileMapConfig) {
        super(isometricTileMapConfig);

    }

    render() {
    }

    _init() {
    }
}