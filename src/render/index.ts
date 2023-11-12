import type REGL from "regl";

export abstract class Render {
    public regl: REGL.Regl;
    constructor(regl: REGL.Regl) {
        this.regl = regl;
    }
    // 初始化渲染指令
    public abstract init(): void;
    // 渲染
    public abstract render(): void;
    // 销毁资源
    public abstract destroy(): void;
}
