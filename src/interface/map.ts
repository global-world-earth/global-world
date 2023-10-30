import { CoreMap } from '../core/map'
// import { Layer } from '../layer/layer';

export class GlobalMap extends CoreMap {
  constructor(opts: MapOptions) {
    super(opts)
    Object.assign(this.status, opts)
  }

  public setViewStatus(status: ViewStatus) {
    return Object.assign(this.status, status)
  }

  public getViewStatus() {
    return this.status
  }

  public requestRender() {
    this.render()
  }
}
