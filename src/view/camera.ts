import { vec3, mat4 } from 'gl-matrix'
import { toRad } from '../utils/math'

export class Camera {
  aspect = 1
  fov = 60
  near = 1
  far = 1000
  size: [number, number] = [1920, 1080]

  cameraPosition: [number, number, number] = [0, 0, 0]
  cameraUp: vec3 = vec3.fromValues(0, 1, 0)
  viewProject: mat4 = mat4.create()

  status: CameraStatus = {
    pitch: 0,
    target: [0, 0],
    rotation: 0,
    height: 1000
  }

  constructor(opts: CameraOptions) {
    this.setOptions(opts)
  }

  setOptions(opts: CameraOptions) {
    this.aspect = opts.aspect || this.aspect
    this.fov = opts.fov || this.fov
    this.near = opts.near || this.near
    this.far = opts.far || this.far
  }

  setStatus(status: CameraStatus) {
    Object.assign(this.status, status)
    this.updateView()
  }

  updateView() {
    this._calcCameraPosition()
    this.updateMatrix()
  }

  updateMatrix() {
    const pro = mat4.create()
    const view = mat4.create()
    mat4.perspectiveNO(pro, toRad(this.fov), this.aspect, this.near, this.far)
    mat4.lookAt(
      view,
      this.cameraPosition,
      vec3.fromValues(this.status.target[0], this.status.target[1], 0),
      this.cameraUp
    )
    console.log('this.near, this.far', this.near, this.far, this.aspect, view, pro)
    mat4.mul(this.viewProject, pro, view)
  }

  getMvp() {
    this.updateMatrix()
    return this.viewProject
  }

  private _calcCameraPosition() {
    const { height, pitch, rotation } = this.status
    const pos = vec3.fromValues(height, 0, 0)
    vec3.rotateY(pos, pos, [0, 0, 0], toRad(pitch))
    vec3.rotateX(pos, pos, [0, 0, 0], toRad(rotation))
    this.cameraPosition = [pos[0], pos[1], pos[2]]
    console.log('this.cameraPosition', this.cameraPosition)
    // target[0], target[1]
  }

  // private _calcUp() {}
}
