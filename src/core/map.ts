import { Event } from './event';
export class CoreMap extends Event {
    constructor(opts: MapOptions) {
        super();
        Object.assign(this.status, opts);
    }
}
