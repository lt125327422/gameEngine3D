/**
 * @class
 */
class Transform {
    constructor() {
        this.x= 0
        this.y= 0
        this.z= 0
        this.scaleX= 1
        this.scaleY= 1
        this.scaleZ= 1
        this.rotateX= 0
        this.rotateY= 0
        this.rotateZ= 0
    }
}


export class GameObjectBasicProps {
    constructor() {
        this.w = 1
        this.h = 1
        this.d = 1
        /**
         *
         * @type {Transform}
         */
        this.transform = null

        /**
         *
         * @type {GameObject[]}
         */
        this.children = []
    }
}

export class GameObject {

    /**
     * @param {GameObjectBasicProps} gameObjectBasicProps
     */
    constructor(gameObjectBasicProps) {

        this.gameObjectBasicProps = gameObjectBasicProps

    }

    _init(){

    }

    /**
     * @virtual
     * @return void
     */
    render(){
    }


}
