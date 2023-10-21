import { Layer } from '../layer/layer';
import { Event } from './event';
export class CoreMap extends Event {
    public status: ViewStatus = {
        center: [116, 40],
        zoom: 12,
        pitch: 0,
        rotation: 0,
    };
    public layers: Layer[] = [];

    constructor(opts: MapOptions) {
        super();
        Object.assign(this.status, opts);
    }


    protected render() {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            layer.render();
        }
    }
}
