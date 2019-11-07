import { Ref } from "@vue/composition-api";
import { Topology } from "topojson-specification";
declare type Props = {
    geography: string | Topology;
    parseGeographies: Function;
};
declare const _default: {
    props: {
        geography: (StringConstructor | ObjectConstructor | ArrayConstructor)[];
        parseGeographies: FunctionConstructor;
    };
    setup(props: Props): {
        geographies: Ref<{
            rsmKey: string;
            svgPath: string;
            type: "Feature";
            geometry: import("geojson").Geometry;
            id?: string | number;
            properties: {
                [name: string]: any;
            };
            bbox?: import("geojson").BBox;
        }[]>;
    };
};
export default _default;
