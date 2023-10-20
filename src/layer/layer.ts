import { Event } from "../core/event";

export abstract class Layer extends Event {
    public id = 'layer';
    public zIndex: number = 1;
    public visible: boolean = true;
    public zooms: [number, number] = [2, 26];

    constructor(opts: LayerOptions) {
        super();
        this._setOptions(opts);
    }

    public setzIndex(zIndex: number) {
        this.zIndex = zIndex;
    }

    public setVisible(visible: boolean) {
        this.visible = visible;
    }

    public setZooms(zooms: [number, number]) {
        this.zooms = zooms;
    }

    private _setOptions(opts: LayerOptions) {
        for (const key in opts) {
            if (Object.prototype.hasOwnProperty.call(opts, key)) {
                (this as any)[key] = (opts as any)[key];
            }
        }
        // this.id = opts.id !== undefined ? opts.id : this.id;
        // this.visible = opts.visible !== undefined ? opts.visible : this.visible;
        // this.zIndex = opts.zIndex !== undefined ? opts.zIndex : this.zIndex;
        // this.zooms = opts.zooms !== undefined ? opts.zooms : this.zooms;
    }
}
