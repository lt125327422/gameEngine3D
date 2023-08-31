import * as Vector2 from "../lib/glMatrix/vec2";

// 0 => walkable
// 1 => start
// 2 => destination
// 4 => obstacle

const obstacle = 4;
const startPoint = 1;
const destinationPoint = 2;

// let mapData = [
//     [1, 4, 0],
//     [0, 4, 0],
//     [0, 0, 2],
// ]

let mapData = [
    [1, 0, 0, 0, 0, 0, 0],
    [0, 0, 4, 4, 4, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 4, 4, 4, 0, 0],
    [0, 0, 4, 4, 4, 0, 0],
    [0, 0, 4, 0, 0, 0, 2],
]

/**
 * @type {Map<string, BaseNode>}
 */
let cachedMap = new Map();

/**
 * @type {BaseNode[]}
 */
let nodes = []

class BaseNode {

    get FCost() {
        return this.GCost + this.HCost
    }

    static Directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ]

    constructor() {
        /**
         * @type {[x:number,y:number]}
         */
        this.coord = null;
        this.type = null;

        /**
         * @type {BaseNode}
         */
        this.connection = null;

        /**
         * @type {BaseNode[]}
         */
        this.neighbors = [];

        this.GCost = 0;
        this.HCost = 0;
    }

    cacheNeighbors() {

    }

    getNeighbors() {
        return this.neighbors
    }

    /**
     * @param {BaseNode} other
     */
    getDistance(other) {
        const [x, y] = Vector2.subtract(Vector2.create(), this.coord, other.coord).map(Math.abs);
        return 1.0 * (x + y)
    }

}

const vec2Str = (vec) => vec.join(",")

const str2Vec = (str) => str.split(",").map(v => parseInt(v, 10))

let startPointNode;
let destinationPointNode;

export class AStar {

    initMap() {

        for (const r in mapData) {
            const row = mapData[r];
            for (const [c, type] of Object.entries(row)) {
                const baseNode = new BaseNode();
                baseNode.coord = Vector2.fromValues(+c, +r)
                baseNode.type = type
                if (baseNode.type === startPoint) {
                    startPointNode = baseNode
                } else if (baseNode.type === destinationPoint) {
                    destinationPointNode = baseNode
                }
                cachedMap.set(vec2Str(baseNode.coord), baseNode)
                nodes.push(baseNode)
            }
        }

        // calculate neighbors for every node
        for (const node of nodes) {
            for (const direction of BaseNode.Directions) {
                const neighborCoord = Vector2.add(Vector2.create(), direction, node.coord);
                const neighbor = cachedMap.get(vec2Str(neighborCoord));
                if (cachedMap.has(vec2Str(neighborCoord)) && neighbor.type !== obstacle) {
                    node.neighbors.push(neighbor)
                }
            }
        }
    }

    /**
     * @param {BaseNode}startNode
     * @param {BaseNode}targetNode
     * @return {BaseNode[]}
     * @constructor
     */
    pathFinding(startNode, targetNode) {

        /**
         * @type {BaseNode[]}
         */
        let toSearch = [];
        toSearch.push(startNode)

        /**
         * @type {BaseNode[]}
         */
        let processed = [];

        while (toSearch.length > 0) {
            //  using heap or bst here to optimize performance
            let current = toSearch[0];
            for (const node of toSearch) {
                if (node.FCost < current.FCost
                    ||  node.FCost === current.FCost && node.HCost < current.HCost) {
                    current = node;
                }
            }

            processed.push(current);
            toSearch = toSearch.filter(v => v !== current)

            if (current === targetNode) {
                //  the path has been found here

                let path = []
                let cur = targetNode
                while (cur !== null) {
                    path.push(cur)
                    cur = cur.connection
                }
                console.log(path.length)
                return path
            }


            for (const neighbor of current.getNeighbors()) {
                if (processed.includes(neighbor)) {
                    continue;
                }

                const inToSearch = toSearch.includes(current);

                const costToNeighbor = current.GCost + current.getDistance(neighbor);

                if (!inToSearch || costToNeighbor < neighbor.GCost) {

                    neighbor.GCost = costToNeighbor;

                    neighbor.connection = current;

                    if (!inToSearch) {
                        neighbor.HCost = neighbor.getDistance(targetNode)
                        toSearch.push(neighbor)
                    }
                }
            }

        }

        return null;

    }

}

(() => {

    const aStar = new AStar();
    aStar.initMap()
    // console.log(startPointNode,destinationPointNode)
    const baseNodes = aStar.pathFinding(startPointNode, destinationPointNode);
    console.log(baseNodes?.map(v => `(${vec2Str(v.coord)})`) ?? "there is no path to des at all!");


    const printCost = (Cost="FCost")=>{
        let costData = Array.from({length: mapData.length}).map(() => ([]))
        for (const [coordStr,node] of cachedMap.entries()) {
            const [x,y] = str2Vec(coordStr);
            costData[y][x] = node[Cost].toString().padStart(2," ");
        }
        console.log(`${Cost} =>`)
        console.log(costData.map(arr=>arr.join(" ")))
        console.log(``)

    }

    const drawPath = ()=>{
        let tileMap = Array.from({length: mapData.length}).map(() => ([]))

        baseNodes?.map((node)=>{

            const [x,y] = node.coord;
            tileMap[y][x] = "*"
        })

        for (const [coordStr,node] of cachedMap.entries()) {
            const [x,y] = str2Vec(coordStr);
            const find = baseNodes?.find((n)=>vec2Str(n.coord) === coordStr);
            if (!find){
                tileMap[y][x] = "1";
            }else{
                tileMap[y][x] = "*";
            }
        }
        console.log(`Path =>`)
        console.log(tileMap.map(arr=>arr.join(" ")))
        console.log(``)
    }

    printCost("FCost")
    printCost("GCost")
    printCost("HCost")
    drawPath()
})()