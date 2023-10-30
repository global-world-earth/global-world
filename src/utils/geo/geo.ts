import REGL from 'regl'
import { Mesh } from '../../ts-type/util'
import { vec3 } from 'gl-matrix'

// 生成球面网格，参考的 threejs
export function sphere(
  regl: REGL.Regl,
  center: [number, number, number],
  radius: number,
  widthSegments = 32,
  heightSegments = 32,
  phiStart = 0,
  phiLength = Math.PI * 2,
  thetaStart = 0,
  thetaLength = Math.PI
): Mesh {
  widthSegments = Math.max(3, Math.floor(widthSegments))
  heightSegments = Math.max(2, Math.floor(heightSegments))
  const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI)
  let index = 0
  const grid = []
  const vertex: number[] = []
  const normal: Float32Array = new Float32Array([0, 1, 0])
  const [ox, oy, oz] = center

  // buffers
  const indices = []
  const vertices = []
  const normals = []
  const uvs = []

  // generate vertices, normals and uvs
  for (let iy = 0; iy <= heightSegments; iy++) {
    const verticesRow = []
    const v = iy / heightSegments
    // special case for the poles

    let uOffset = 0
    if (iy === 0 && thetaStart === 0) {
      uOffset = 0.5 / widthSegments
    } else if (iy === heightSegments && thetaEnd === Math.PI) {
      uOffset = -0.5 / widthSegments
    }

    for (let ix = 0; ix <= widthSegments; ix++) {
      const u = ix / widthSegments
      // vertex
      vertex[0] = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
      vertex[1] = radius * Math.cos(thetaStart + v * thetaLength)
      vertex[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
      vertices.push(vertex[0] + ox, vertex[1] + oy, vertex[2] + oz)
      // normal
      vec3.normalize(normal, new Float32Array(vertex))
      normals.push(normal[0], normal[1], normal[2])
      // uv
      uvs.push(u + uOffset, 1 - v)
      verticesRow.push(index++)
    }
    grid.push(verticesRow)
  }

  // indices
  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = grid[iy][ix + 1]
      const b = grid[iy][ix]
      const c = grid[iy + 1][ix]
      const d = grid[iy + 1][ix + 1]

      if (iy !== 0 || thetaStart > 0) indices.push(a, b, d)
      if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d)
    }
  }

  return {
    index: regl.elements({
      primitive: 'triangles',
      type: 'uint32',
      data: indices
    }),
    vertex: {
      buffer: regl.buffer(vertices),
      offset: 0,
      stride: 4 * 3,
      normalized: false,
      divisor: 0
    },
    normal: {
      buffer: regl.buffer(normal),
      offset: 0,
      stride: 4 * 3,
      normalized: false,
      divisor: 0
    },
    uv: {
      buffer: regl.buffer(uvs),
      offset: 0,
      stride: 4 * 2,
      normalized: false,
      divisor: 0
    }
  }
}
