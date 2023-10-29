interface CameraOptions {
    aspect: number;
    fov: number;
    near: number;
    far: number;
}
interface CameraStatus {
    target: [number, number];
    pitch: number;
    rotation: number;
    height: number;
}