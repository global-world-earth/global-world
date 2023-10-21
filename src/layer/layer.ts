import { Event } from "../core/event";
import { GlobalMap } from "../interface/map";
import { LayerOptions } from "../ts-type/layer";

export abstract class Layer extends Event {
    public id = 'layer';
    public zIndex: number = 1;
    public opacity: number = 1;
    public visible: boolean = true;
    public zooms: [number, number] = [2, 26];
    // 是否预加载数据
    public preLoad: boolean = false;
    public depth: boolean = false;
    public map: GlobalMap | undefined;

    constructor(opts: LayerOptions) {
        super();
        this._setOptions(opts);

        if (opts.map) {
            this.setMap(opts.map);
        }
    }

    /**
     * 需要实现是否加载数据，是否渲染等逻辑
     */
    public abstract render: () => void;

    public setMap(map: GlobalMap | null) {
        if (this.map === map) {
            return;
        }
        if (map) {
            this.map = map;
            this.onAdd();
        } else {
            this.map = undefined;
        }
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

    public setOpacity(opacity: number) {
        this.opacity = opacity;
    }

    public destroy() {
        this.map = undefined;
    }

    /**
     * 当添加到地图上的时候
     */
    protected onAdd() {
        if (this.preLoad) {

        }
        this.map?.requestRender();
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
