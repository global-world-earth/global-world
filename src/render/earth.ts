import REGL from 'regl'
import { Mesh } from '../ts-type/util'
import { sphere } from '../utils/geo/geo'
import { View } from '../view/view'
import { EllipseProjection } from '../utils/projection/global'
import { Render } from '.'

export class Earth extends Render {
    public view: View = new View();
    // 测试用球
    public interactiveSphere: Mesh;

    constructor(regl: REGL.Regl) {
        super(regl);
        this.interactiveSphere = sphere(regl, [EllipseProjection.a, 0, 0], EllipseProjection.a);
    }

    public init(): void {

    }

    public render(): void {

    }

    public destroy(): void {

    }
}
