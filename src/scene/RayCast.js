import {vec3} from "../lib";
import {glCtx} from "../globalShared";

export class Ray {
    constructor(origin, dir, maxLength=Infinity) {
        this.origin = origin
        this.dir = dir
        this.maxLength = maxLength
    }
}

export class RayCast {
    constructor() {


    }

    bvh(){

    }

    aabb(){

    }

    static mock(sprite){
        glCtx.canvas.addEventListener("click",({clientX,clientY})=>{
            console.log(clientX,clientY)
            // console.log(sprite.p0)
            // console.log(sprite.p1)
            // console.log(sprite.p2)
            // console.log(sprite.p3)

            // console.log(vec3.normalize(vec3.create(),vec3.fromValues(clientX,clientY,.1)))

            // const origin = vec3.fromValues(0,0,-.1);
            // const ray = new Ray(origin,vec3.fromValues(clientX,clientY,.1));
            // RayCast.castRay(ray)
        })

    }

    /**
     * @param ray {Ray}
     */
    static castRay(ray) {
        const p0 = vec3.create();
        const p1 = vec3.create();
        const p2 = vec3.create();
        let pointsOfTriangle = [p0, p1, p2]

        const p01 = vec3.subtract(vec3.create(), p1, p0)
        const p02 = vec3.subtract(vec3.create(), p2, p0)

        const n = vec3.cross(vec3.create(), p01, p02);

        const pPrimeMinusO = vec3.subtract(vec3.create(), p0, ray.origin);
        const numerator = vec3.dot(pPrimeMinusO, n)

        const denominator = vec3.dot(ray.dir, n)

        const t = numerator / denominator;

        if (t < .0001) {
            console.log("light is even not intersection with plane")
            return
        }

        const td = vec3.scale(vec3.create(), ray.dir, t);
        const rt = vec3.add(td, td, ray.origin);    //  pointInPlane

        const isInsideTriangle = () => {
            const p01 = vec3.subtract(vec3.create(), p1, p0)
            const p0i = vec3.subtract(vec3.create(), rt, p0)

            const p12 = vec3.subtract(vec3.create(), p2, p1)
            const p1i = vec3.subtract(vec3.create(), rt, p1)

            const p02 = vec3.subtract(vec3.create(), p0, p2)
            const p2i = vec3.subtract(vec3.create(), rt, p2)

            const a = vec3.cross(vec3.create(), p01, p0i);
            const b = vec3.cross(vec3.create(), p12, p1i);
            const c = vec3.cross(vec3.create(), p02, p2i);

            if (vec3.dot(a, b) > 0 && vec3.dot(b, c) > 0 && vec3.dot(c, a) > 0) {
                console.log("point is inside the triangle .")
            }
            console.log("point is outside the triangle .")
        }

        isInsideTriangle()

    }
}
