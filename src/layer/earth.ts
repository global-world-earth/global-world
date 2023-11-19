import { EarthRender } from '../render/earth'
import { Layer } from "./layer"
import type { LayerOptions } from "../../types/layer"

export class EarthLayer extends Layer {
  constructor(opts: LayerOptions) {
    super(opts)
    this.renderer = new EarthRender(this.regl)
  }

  public render() {
    if (!this.canRender()) {
      return
    }

    this.renderer?.render({
      map: this.map,
      view: this.map?.view,
    })
  }
}