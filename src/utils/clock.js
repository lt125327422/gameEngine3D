import {platform} from "../plantform";

export const nextFrame = () =>
    new Promise((resolve) => void platform.requestAnimationFrame(resolve))

export const sleep = (duration = 1000) =>
    new Promise((resolve) => void setTimeout(resolve, duration))

export const waitUntil = async (conditionFn = () => true, duration = 0) => {
    await Promise.race([
        (async () => {
            while (!conditionFn()) await nextFrame()
        })(),
        ...(() => {
            return duration ? [
                sleep(duration)
            ] : []
        })()
    ])
}

