import { Ref } from "@vue/composition-api";
declare const _default: {
    components: {
        mapProvider: import("vue").VueConstructor<import("vue").default>;
    };
    inheritAttrs: boolean;
    props: {
        width: {
            type: NumberConstructor;
            default: number;
        };
        height: {
            type: NumberConstructor;
            default: number;
        };
        projection: {
            type: (StringConstructor | FunctionConstructor)[];
            default: string;
        };
        projectionConfig: {
            type: ObjectConstructor;
            default: () => void;
        };
    };
    setup(): {
        svg: Ref<SVGSVGElement>;
    };
};
export default _default;
