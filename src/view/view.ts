import { mat4 } from 'gl-matrix';
import { Event } from '../core/event'
import { Camera } from './camera';
import { EllipseProjection } from '../utils/projection/global';

export class View extends Event {
  public mvpMatrix: mat4 = mat4.create();
  public camera: Camera = new Camera({
    fov: 45,
    aspect: 1,
    near: 0.1,
    far: 1000
  });

  constructor() {
    super()
    this.setHeight(EllipseProjection.a * 2)
    // this.setHeight(10)
  }

  public setHeight(height: number) {
    this.camera.far = height * 20;
    this.camera.near = height / 100;
    this.camera.setStatus({
      target: [0, 0],
      pitch: 0,
      rotation: 0,
      height,
    })
  }

  public getMVPMatrix() {
    console.log(this.camera.viewPro);
    return this.camera.viewPro
    // return this.mvpMatrix
  }
}
