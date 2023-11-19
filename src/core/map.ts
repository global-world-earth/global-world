import REGL from 'regl'
import { watchSize } from '../utils/dom/dom'
import { env } from '../utils/dom/env'
import { Event } from './event'
import type { Layer } from '../layer/layer'
import type { Regl } from 'regl'
import { View } from '../view/view'

export class CoreMap extends Event {
  status: ViewStatus = {
    center: [116, 40],
    zoom: 12,
    pitch: 0,
    rotation: 0
  }
  layers: Layer[] = []
  regl!: Regl
  container!: HTMLElement | null
  canvas!: HTMLCanvasElement
  view!: View

  protected _waitingRender = 0

  constructor(opts: MapOptions) {
    super()
    Object.assign(this.status, opts)
    this._initDom(opts.container)

    if (this.container) {
      this.on('glready', this.ready)

      REGL({
        canvas: this.canvas,
        extensions: ['OES_element_index_uint', 'ANGLE_instanced_arrays'],
        onDone: (err: any, regl: any) => {
          if (err) {
            console.error(err)
          } else {
            this.regl = regl
            regl.poll()
            this.emit('glready');
          }
        }
      })
    }
  }

  getRegl() {
    return this.regl
  }

  requestRender() {
    if (this._waitingRender === 0) {
      this._waitingRender = requestAnimationFrame(() => {
        this.render()
        this._waitingRender = 0
      })
    }
  }

  ready() {
    this.requestRender();
  }

  getContainer() {
    return this.container
  }

  protected render() {
    this.regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    })
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      layer.render(this)
    }
  }

  private _initDom(id: string) {
    this.container = document.getElementById(id)
    if (!this.container) {
      console.error('没有找到 id 为', id, '的元素，请检查 "container" 属性的值！')
      return false
    }
    this.view = new View(this)
    const layersContainer = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'gm-canvas'

    watchSize(this.container, (w: number, h: number) => {
      this.canvas.width = w * env.devicePixelRatio()
      this.canvas.height = h * env.devicePixelRatio()
      this.canvas.style.width = `${w}px`
      this.canvas.style.height = `${h}px`
      this.view.setAspect(w / h)
      this.regl && this.regl.poll()
      this.emit('resize', { width: w, heigt: h })
      this.requestRender()
    })

    layersContainer.className = 'gmap-layers'
    layersContainer.style.position = 'absolute'
    layersContainer.style.left = '0'
    layersContainer.style.top = '0'
    layersContainer.style.overflow = 'hidden'
    layersContainer.style.width = '100%'
    layersContainer.style.height = '100%'

    this.container.appendChild(layersContainer)
    layersContainer.appendChild(this.canvas)

  }
}
