import type REGL from 'regl'
import type { Mesh } from '../../types/util'
import { sphere } from '../utils/geo/geo'
import { View } from '../view/view'
import { EllipseProjection } from '../utils/projection/global'
import BaseVertexShader from '../shader/base/base.vertex.glsl'
import BaseFragmentShader from '../shader/base/base.fragment.glsl'
import { Render } from '.'
// import { mat4 } from 'gl-matrix'

export class EarthRender extends Render {
  public view: View = new View();
  // 测试用球
  public interactiveSphere: Mesh;

  public drawSphere!: REGL.DrawCommand

  constructor(regl: REGL.Regl) {
    super(regl);
    // this.interactiveSphere = sphere(regl, [0, 0, 0], 2, 32, 32);
    this.interactiveSphere = sphere(regl, [-EllipseProjection.a, 0, 0], EllipseProjection.a, 32, 32);
    this.init();
  }

  public init(): void {
    this.drawSphere = this.regl({
      vert: BaseVertexShader,
      frag: BaseFragmentShader,
      // cull: {
      //   enable: false,
      //   face: 'back',
      // },
      // depth: {
      //   enable: false,
      // },
      attributes: {
        position: this.regl.prop('position'),
      },
      uniforms: {
        mvp: this.regl.prop('mvp'),
      },
      depth: { enable: false },
      blend: {
          enable: false,
      },
      // count: 10,
      // primitive: 'points'
      elements: this.regl.prop('index'),
    });
  }

  public render(): void {
    console.log('this.view.getMVPMatrix()', this.view.getMVPMatrix());
    this.drawSphere({
      position: this.interactiveSphere.vertex,
      index: this.interactiveSphere.index,
      // mvp: mat4.create(),
      mvp: this.view.getMVPMatrix(),
    });
  }

  public destroy(): void {
    console.log('destroy');
  }
}
