import REGL from "regl";

interface MeshBuffer {
    buffer: REGL.Buffer,
    offset: number,
    stride: number,
    normalized: boolean,
    divisor: number,
}

interface Mesh {
    index: REGL.Elements;
    vertex: MeshBuffer;
    color?: MeshBuffer;
    normal?: MeshBuffer;
    uv?: MeshBuffer;
}
