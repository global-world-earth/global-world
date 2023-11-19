import type REGL from 'regl'
import type { Mesh, TextureData } from '../../types/util'
import { sphere } from '../utils/geo/geo'
import { EllipseProjection } from '../utils/projection/global'
import BaseVertexShader from '../shader/base/base.vertex.glsl'
import BaseFragmentShader from '../shader/base/base.fragment.glsl'
import { Render } from '.'
import { STATUS, loadTexture } from '../utils/render'
// import { mat4 } from 'gl-matrix'

export class EarthRender extends Render {
  // 测试用球
  interactiveSphere: Mesh
  drawSphere!: REGL.DrawCommand

  private _earthTex: TextureData = {
    status: STATUS.unload,
    texture: null,
  };

  constructor(regl: REGL.Regl) {
    super(regl);
    // this.interactiveSphere = sphere(regl, [0, 0, 0], 2, 32, 32);
    this.interactiveSphere = sphere(regl, [-EllipseProjection.a, 0, 0], EllipseProjection.a, 32, 32);
    this.init();
  }

  init(): void {
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
      blend: {
        enable: false,
      },
      attributes: {
        position: this.regl.prop('position'),
        uv: this.regl.prop('uv'),
      },
      uniforms: {
        mvp: this.regl.prop('mvp'),
        texture: this.regl.prop('texture'),
      },
      // count: 10,
      // primitive: 'points'
      elements: this.regl.prop('index'),
    });
  }

  render(opt: any): void {
    this._loadTexture(opt)
    if (this._earthTex.status == STATUS.loaded) {
      this.drawSphere({
        position: this.interactiveSphere.vertex,
        uv: this.interactiveSphere.uv,
        index: this.interactiveSphere.index,
        mvp: opt.view.getMVPMatrix(),
        texture: this._earthTex.texture,
      })
    }
  }

  destroy(): void {
    console.log('destroy')
    this._earthTex.texture && this._earthTex.texture.destroy()
  }

  // 临时测试写在这里
  private _loadTexture(opt: any) {
    if (this._earthTex.status != STATUS.unload) {
      return;
    }

    this._earthTex.status = STATUS.loading
    loadTexture(this.regl, '../../assets/earth.jpeg', true, (error, tex) => {
      if (tex) {
        this._earthTex.texture = tex
        this._earthTex.status = STATUS.loaded
        opt.map && opt.map.requestRender()
        console.log('加载成功')
      } else {
        console.log('加载错误:', error)
        this._earthTex.status = STATUS.error
      }
    })
  }
}
