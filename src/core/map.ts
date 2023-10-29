import REGL from 'regl'
import { watchSize } from '../utils/dom/dom'
import { env } from '../utils/dom/env'
import { Event } from './event'
import type { Layer } from '../layer/layer'
import type { Regl } from 'regl'
export class CoreMap extends Event {
  public status: ViewStatus = {
    center: [116, 40],
    zoom: 12,
    pitch: 0,
    rotation: 0
  }
  public layers: Layer[] = []
  public regl!: Regl
  public container!: HTMLElement | null
  public canvas!: HTMLCanvasElement

  constructor(opts: MapOptions) {
    super()
    Object.assign(this.status, opts)
    this._initDom(opts.container)

    if (this.container) {
      REGL({
        container: this.container,
        extensions: ['OES_element_index_uint', 'ANGLE_instanced_arrays'],
        onDone: (err: any, regl: any) => {
          if (err) {
            console.error(err)
          } else {
            this.regl = regl
          }
        }
      })
    }
  }

  protected render() {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      layer.render()
    }
  }

  private _initDom(id: string) {
    this.container = document.getElementById(id)
    if (!this.container) {
      console.error('没有找到 id 为', id, '的元素，请检查 "container" 属性的值！')
      return false
    }
    const canvasContainer = document.createElement('div')
    this.canvas = document.createElement('canvas')

    canvasContainer.className = 'gmap-layers'
    canvasContainer.style.width = '100%'
    canvasContainer.style.height = '100%'
    this.canvas.width = 0
    this.canvas.height = 0

    this.container.appendChild(canvasContainer)
    canvasContainer.appendChild(this.canvas)

    watchSize(this.container, (w: number, h: number) => {
      this.canvas.width = w * env.devicePixelRatio()
      this.canvas.height = h * env.devicePixelRatio()
      this.canvas.style.width = `${w}px`
      this.canvas.style.height = `${h}px`
    })
    return true
  }
}
