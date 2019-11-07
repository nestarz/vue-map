import { Ref } from "@vue/composition-api";
declare const _default: {
    components: {
        mapProvider: import("vue").VueConstructor<import("vue").default>;
    };
    inheritAttrs: boolean;
    props: {
        projection: {
            type: (StringConstructor | FunctionConstructor)[];
            default: string;
        };
        projectionConfig: {
            type: ObjectConstructor;
            default: () => void;
        };
        canvas: BooleanConstructor;
    };
    setup(): {
        svg: Ref<SVGSVGElement>;
        parent: any;
        width: Ref<number>;
        height: Ref<number>;
    };
};
export default _default;
