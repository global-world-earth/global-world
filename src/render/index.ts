import type REGL from "regl";

export abstract class Render {
    regl: REGL.Regl;
    constructor(regl: REGL.Regl) {
        this.regl = regl;
    }
    // 初始化渲染指令
    abstract init(): void;
    // 渲染
    abstract render(options: any): void;
    // 销毁资源
    abstract destroy(): void;
}
