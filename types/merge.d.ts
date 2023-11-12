import REGL from 'regl';

declare module 'regl' {
    export interface Regl {
        prop(key: string): REGL.MaybeDynamic<any, any, any>;
    }
}