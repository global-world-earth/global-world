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
    this.setHeight(EllipseProjection.a * 2)
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

  setCenter(center: [number, number]) {
    const status = this.camera.getStatus()
    this.camera.setStatus({
      ...status,
      target: center,
    })
    this.map.requestRender()
  }

  setHeight(height: number) {
    this.camera.far = height * 20
    this.camera.near = height / 100
    this.camera.setStatus({
      target: [0, 0],
      pitch: 0,
      rotation: 0,
      height,
    })
    this.map.requestRender()
  }

  setAspect(aspect: number) {
    this.camera.aspect = aspect
    this.map.requestRender()
  }

  getMVPMatrix() {
    return this.camera.getMvp()
  }
}
