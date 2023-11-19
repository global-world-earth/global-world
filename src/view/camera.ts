import { vec3, mat4 } from 'gl-matrix'
import { toRad } from '../utils/math'

// 右手坐标系
// x 轴正方向是经纬度 [0, 0]
// z 轴正方向是正北
// y 轴正方向是维度 90 度
export class Camera {
  aspect = 1
  fov = 60
  near = 1
  far = 1000
  size: [number, number] = [1920, 1080]

  position: [number, number, number] = [0, 0, 0]
  up: vec3 = vec3.fromValues(0, 1, 0)
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

  getStatus() {
    return this.status
  }

  updateView() {
    this._calcCameraPosition()
    this._calcUp()
    this.updateMatrix()
  }

  updateMatrix() {
    const pro = mat4.create()
    const view = mat4.create()
    mat4.perspectiveNO(pro, toRad(this.fov), this.aspect, this.near, this.far)
    console.log('up', ...this.up, 'position', ...this.position, 'target', ...this.status.target);
    mat4.lookAt(
      view,
      this.position,
      vec3.fromValues(this.status.target[0], this.status.target[1], 0),
      this.up
    )
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
    this.position = [pos[0], pos[1], pos[2]]
  }

  private _calcUp() {
    const { pitch, rotation } = this.status
    const up = vec3.fromValues(0, 0, 1)
    vec3.rotateY(up, up, [0, 0, 0], toRad(pitch))
    vec3.rotateX(up, up, [0, 0, 0], toRad(rotation))
    this.up = up
  }
}
