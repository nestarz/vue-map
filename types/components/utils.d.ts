import { Topology } from "topojson-specification";
import { GeoPath } from "d3";
import * as GeoJSON from "geojson";
export declare function fetchGeographies(url: string): Promise<any>;
export declare function getFeatures(geographies: Topology, parseGeographies: Function): any;
export declare function prepareFeatures(features: Array<GeoJSON.Feature>, path: GeoPath): {
    rsmKey: string;
    svgPath: string;
    type: "Feature";
    geometry: GeoJSON.Geometry;
    id?: string | number;
    properties: {
        [name: string]: any;
    };
    bbox?: GeoJSON.BBox;
}[];
export declare function createConnectorPath(dx?: number, dy?: number, curve?: number): string;
export declare function isString(geo: string | Topology): geo is string;
export declare const ContextSymbol: unique symbol;
