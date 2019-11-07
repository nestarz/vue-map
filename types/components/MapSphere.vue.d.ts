declare const _default: {
    inheritAttrs: boolean;
    props: {
        id: {
            type: StringConstructor;
            default: string;
        };
        fill: {
            type: StringConstructor;
            default: string;
        };
        stroke: {
            type: StringConstructor;
            default: string;
        };
        strokeWidth: {
            type: NumberConstructor;
            default: number;
        };
    };
    setup(props: any): {
        canvas: any;
        spherePath: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
