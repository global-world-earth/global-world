import REGL from "regl";
import { Mesh } from "../ts-type/util";
import { sphere } from "../utils/geo/geo";
import { View } from "../view/view";
import { EllipseProjection } from "../utils/projection/global";

export class Earth {
    public view: View = new View();
    // 测试用球
    public mesh: Mesh;

    constructor(regl: REGL.Regl) {
        this.mesh = sphere(regl, [EllipseProjection.a, 0, 0], EllipseProjection.a);
    }

    render() {

    }
}
