import REGL, { Texture } from 'regl'
import { STATUS } from '../src/utils/render'

interface MeshBuffer {
  buffer: REGL.Buffer
  offset: number
  stride: number
  normalized: boolean
  divisor: number
}

interface Mesh {
  index: REGL.Elements
  vertex: MeshBuffer
  color?: MeshBuffer
  normal?: MeshBuffer
  uv?: MeshBuffer
}

interface TextureData {
  status: STATUS
  texture: Texture | null
}
