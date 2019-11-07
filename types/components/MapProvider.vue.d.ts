import { Ref } from "@vue/composition-api";
import { GeoProjection, GeoPath } from "d3";
declare type ProjectionConfig = {
    center: [number, number] | null;
    rotate: [number, number] | null;
    scale: number | null;
    parallels: [number, number] | null;
    [key: string]: any;
};
declare type Props = {
    width: number;
    height: number;
    projection: string | Function;
    projectionConfig: ProjectionConfig;
    svg: SVGSVGElement;
};
declare const _default: {
    props: {
        width: NumberConstructor;
        height: NumberConstructor;
        projection: (StringConstructor | FunctionConstructor)[];
        projectionConfig: ObjectConstructor;
        svg: {
            new (): SVGSVGElement;
            prototype: SVGSVGElement;
            readonly SVG_ZOOMANDPAN_DISABLE: number;
            readonly SVG_ZOOMANDPAN_MAGNIFY: number;
            readonly SVG_ZOOMANDPAN_UNKNOWN: number;
        };
    };
    setup(props: Props): {
        path: Ref<GeoPath<any, import("d3-geo").GeoPermissibleObjects>>;
        projectionFunc: Ref<GeoProjection>;
    };
};
export default _default;
