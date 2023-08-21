
/**
 * @type {WebGL2RenderingContext}
 */
export let glCtx = null;

export const setGlCtx = gl => void (glCtx = gl)

// export let gameEngine3D = null;


/**
 * @type {Scene}
 */
export let currentScene = null;

export const setCurrentScene = scene => void (currentScene = scene)

