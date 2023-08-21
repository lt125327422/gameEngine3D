export class RenderQueue {
    constructor() {
        this.renderQueue = []

    }

    _clearRenderQueue(){
        this.renderQueue.length = 0
    }

    _addToRenderQueue(render){
        this.renderQueue.push(render)
    }
}