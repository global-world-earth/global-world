import { mat4 } from 'gl-matrix';
import { Event } from '../core/event'
import { Camera } from './camera'
import { EllipseProjection } from '../utils/projection/global'
import type { CoreMap } from '../core/map';
import { UIEvents } from './ui-event';

export class View extends Event {
  mvpMatrix: mat4 = mat4.create()
  uiEvents: UIEvents
  map: CoreMap
  size = [0, 0]
  zoom = 2
  camera: Camera = new Camera({
    fov: 45,
    aspect: 1,
    near: 0.1,
    far: 1000
  })

  constructor(map: CoreMap) {
    super()
    this.uiEvents = new UIEvents(map)
    this.map = map
    this._cameraOptionsByZoom()
  }

  addPitch(delta: number) {
    const status = this.camera.getStatus()
    const p = status.pitch + delta;
    this.camera.setStatus({
      ...status,
      pitch: Math.max(0, Math.min(p, 90))
    })
    this.map.requestRender()
  }

  addRotation(delta: number) {
    const status = this.camera.getStatus()
    this.camera.setStatus({
      ...status,
      rotation: status.rotation + delta,
    })
    this.map.requestRender()
  }

  addZoom(delta: number) {
    this.zoom += delta
    this.zoom = Math.min(this.map.status.zooms[1], Math.max(this.map.status.zooms[0], this.zoom))
    this._cameraOptionsByZoom()
  }

  setZoom(zoom: number) {
    this.zoom = zoom
    this.zoom = Math.min(this.map.status.zooms[1], Math.max(this.map.status.zooms[0], this.zoom))
    this._cameraOptionsByZoom()
  }

  setCenter(center: [number, number]) {
    const status = this.camera.getStatus()
    this.camera.setStatus({
      ...status,
      target: center,
    })
    this.map.requestRender()
  }


  setAspect(aspect: number) {
    this.camera.aspect = aspect
    this.map.requestRender()
  }

  setSize(w: number, h: number) {
    this.size = [w, h]
    this._cameraOptionsByZoom()
  }

  getMVPMatrix() {
    return this.camera.getMvp()
  }

  // 根据 zoom，计算相机的相关高度，以及高度对应的远近平面
  private _cameraOptionsByZoom() {
    const status = this.camera.getStatus()
    const height = this._calcHeight(this.zoom)
    this.camera.far = height * 20
    this.camera.near = height / 100
    this.camera.setStatus({
      ...status,
      height,
    })
    this.map.requestRender()
  }

  private _calcHeight(zoom: number) {
    const res = EllipseProjection.GetResolution(zoom);
    return this.size[1] / 2 * res;
  }
}
