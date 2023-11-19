import type { Texture, Regl, Texture2DOptions } from "regl";

export enum STATUS {
    'loaded',
    'unload',
    'loading',
    'abort',
    'error'
}

// 加载纹理
export function loadTexture(regl: Regl, url: string, mipmap: boolean, callback: (error: string | null, texture: null | Texture) => void) {
    const img = new Image()
    img.crossOrigin = '*'
    img.onload = () => {
        let opt: Texture2DOptions = {
            format: 'rgba',
            data: img
        }
        if (mipmap) {
            opt = {
                mag: 'linear',
                min: 'linear mipmap linear',
                mipmap: true,
                format: 'rgba',
                data: fillCanvas(img),
            }
        }
        const tex = regl.texture(opt)
        callback(null, tex)
    }
    img.onerror = (e) => {
        callback(e.toString(), null)
    }
    img.src = url
}

export function fillCanvas(img: HTMLImageElement): HTMLImageElement | HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    if (img) {
        const { width, height } = img
        const w = 1 << (Math.ceil(Math.log2(width)))
        const h = 1 << (Math.ceil(Math.log2(height)))
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, w, h)
        return canvas
    }
    return img
}
