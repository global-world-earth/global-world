import type REGL from 'regl'
import { Event } from '../core/event'
import type { GlobalMap } from '../interface/map'
import type { Render } from '../render'
import type { LayerOptions } from '../../types/layer'
import { CoreMap } from '../core/map'

export abstract class Layer extends Event {
  public id = 'layer'
  public zIndex = 1
  public opacity = 1
  public visible = true
  public zooms: [number, number] = [2, 26]
  // 是否预加载数据
  public preLoad = false
  public depth = false
  public map: GlobalMap | undefined
  public regl!: REGL.Regl

  protected renderer: Render | undefined;

  constructor(opts: LayerOptions) {
    super()
    this._setOptions(opts)

    if (opts.map) {
      this.setMap(opts.map, true)
    }
  }

  /**
   * 需要实现是否加载数据，是否渲染等逻辑
   */
  public abstract render(map: CoreMap): void

  public setMap(map: GlobalMap | null, force = true) {
    if (!force && this.map === map) {
      return
    }
    if (map) {
      this.map = map
      this.regl = map.getRegl()
      this.onAdd()
    } else {
      this.map = undefined
    }
  }

  public setzIndex(zIndex: number) {
    this.zIndex = zIndex
  }

  public setVisible(visible: boolean) {
    this.visible = visible
  }

  public setZooms(zooms: [number, number]) {
    this.zooms = zooms
  }

  public setOpacity(opacity: number) {
    this.opacity = opacity
  }

  public destroy() {
    this.map = undefined
  }

  /**
   * 当添加到地图上的时候
   */
  protected onAdd() {
    this.map?.requestRender()
  }

  // 判断是否可以渲染
  protected canRender() {
    if (!this.map) {
      return false;
    }

    if (!this.visible) {
      return false;
    }

    const { zoom } = this.map.getViewStatus();
    if (this.zooms[0] > zoom && this.zooms[1] < zoom) {
      return false;
    }

    return true;
  }

  private _setOptions(opts: LayerOptions) {
    for (const key in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, key)) {
        (this as any)[key] = (opts as any)[key]
      }
    }
    // this.id = opts.id !== undefined ? opts.id : this.id;
    // this.visible = opts.visible !== undefined ? opts.visible : this.visible;
    // this.zIndex = opts.zIndex !== undefined ? opts.zIndex : this.zIndex;
    // this.zooms = opts.zooms !== undefined ? opts.zooms : this.zooms;
  }
}
