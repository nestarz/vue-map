declare type Vector2 = [number, number];
declare type Props = {
    step: Vector2;
};
declare const _default: {
    props: {
        step: {
            type: ArrayConstructor;
            default: () => number[];
        };
    };
    setup(props: Props, { attrs }: any): {
        canvas: any;
        graticulePath: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
