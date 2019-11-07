import * as d3 from "d3";
import { Ref } from "@vue/composition-api";
declare const zoom: (projection: d3.GeoProjection, path: d3.GeoPath<any, d3.GeoPermissibleObjects>, svg: SVGSVGElement, update: Ref<number>) => d3.ZoomBehavior<Element, unknown>;
declare const drag: (projection: d3.GeoProjection, path: d3.GeoPath<any, d3.GeoPermissibleObjects>, svg: SVGSVGElement, update: Ref<number>) => d3.DragBehavior<Element, unknown, unknown>;
export { zoom, drag };
