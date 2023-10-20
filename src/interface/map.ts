import { CoreMap } from '../core/map';
export class GlobalMap extends CoreMap {
    public status: ViewStatus = {
        center: [116, 40],
        zoom: 12,
        pitch: 0,
        rotation: 0,
    };

    public layers: Layer = [];

    constructor(opts: MapOptions) {
        super(opts);
        Object.assign(this.status, opts);
    }

    public setViewStatus() {

    }

    private _render() {

    }
}
