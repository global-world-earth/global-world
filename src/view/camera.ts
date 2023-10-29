import { vec3, mat4 } from 'gl-matrix';
import { toRad } from '../utils/math';

export class Camera {
    aspect: number = 1;
    fov: number = 60;
    near: number = 1;
    far: number = 1000;
    size: [number, number] = [1920, 1080];

    cameraPosition: [number, number, number] = [0, 0, 0];
    cameraUp: vec3 = vec3.create();
    viewMatrix: mat4 = mat4.create();

    status: CameraStatus = {
        pitch: 0,
        target: [0, 0],
        rotation: 0,
        height: 1000,
    };


    constructor(opts: CameraOptions) {
        this.setOptions(opts);
    }

    setOptions(opts: CameraOptions) {
        this.aspect = opts.aspect;
        this.fov = opts.fov;
        this.near = opts.near;
        this.far = opts.far;
    }

    setStatus(status: CameraStatus) {
        Object.assign(this.status, status);
        this.updateView();
    }

    updateView() {
        this._calcCameraPosition();
    }

    updateMatrix() {
        mat4.perspectiveNO(this.viewMatrix, this.fov, this.aspect, this.near, this.far);
        mat4.lookAt(this.viewMatrix, this.cameraPosition, vec3.fromValues(this.status.target[0], this.status.target[1], 0), this.cameraUp);
    }

    private _calcCameraPosition() {
        const { height, pitch, rotation, target } = this.status;
        const pos = vec3.fromValues(0, 0, height);
        vec3.rotateY(pos, pos, [0, 0, 0], toRad(pitch));
        vec3.rotateX(pos, pos, [0, 0, 0], toRad(rotation));
        // target[0], target[1]
    }

    private _calcUp() {
        
    }
}
