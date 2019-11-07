import { InjectionKey } from "@vue/composition-api";
import { GeoProjection, GeoPath } from "d3";
declare type Context = {
    path: GeoPath;
    projection: GeoProjection;
    update: number;
};
declare const ContextSymbol: InjectionKey<Context>;
export default ContextSymbol;
