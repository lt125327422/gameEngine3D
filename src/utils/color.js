import {vec3, vec4} from "../lib";

/**
 * @public
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @return {Float32List}
 */
export const getNormalizedRGBA = (r, g, b, a = 1.) => {
    const color = vec3.fromValues(r, g, b);
    vec3.normalize(color, color)
    return vec4.fromValues(...color, a)
}

export const defaultColor = getNormalizedRGBA(27, 195, 162)