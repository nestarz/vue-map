import { InjectionKey } from "@vue/composition-api";
import { GeoProjection, GeoPath } from "d3";
declare type Context = {
    path: GeoPath;
    projection: GeoProjection;
    update: number;
    canvas: any;
    svg: any;
};
declare const ContextSymbol: InjectionKey<Context>;
export default ContextSymbol;
