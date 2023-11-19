import { CoreMap } from '../core/map'
import { EarthLayer } from '../layer/earth'
// import { Layer } from '../layer/layer';

export class GlobalMap extends CoreMap {
  constructor(opts: MapOptions) {
    super(opts)
    Object.assign(this.status, opts)
  }

  setViewStatus(status: ViewStatus) {
    return Object.assign(this.status, status)
  }

  getViewStatus() {
    return this.status
  }

  ready(): void {
    super.ready();
    this.addEarth();
  }

  protected addEarth() {
    this.layers.push(new EarthLayer({
      id: 'earth',
      map: this,
      zooms: [0, 30],
      zIndex: 0,
      visible: true,
      preLoad: true,
      depth: true,
    }))
  }
}
