import { mat4 } from 'gl-matrix';
import { Event } from '../core/event'
import { Camera } from './camera'
import { EllipseProjection } from '../utils/projection/global'

export class View extends Event {
  mvpMatrix: mat4 = mat4.create()
  camera: Camera = new Camera({
    fov: 45,
    aspect: 1,
    near: 0.1,
    far: 1000
  })

  constructor() {
    super()
    this.setHeight(EllipseProjection.a * 2)
    // this.setHeight(10)
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
  }

  setAspect(aspect: number) {
    this.camera.aspect = aspect
  }

  getMVPMatrix() {
    return this.camera.getMvp()
  }
}
