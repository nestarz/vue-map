declare type Vector2 = [number, number];
declare type Props = {
    fill: String;
    stroke: String;
    step: Vector2;
};
declare const _default: {
    props: {
        fill: {
            type: StringConstructor;
            default: string;
        };
        stroke: {
            type: StringConstructor;
            default: string;
        };
        step: {
            type: ArrayConstructor;
            default: () => number[];
        };
    };
    setup(props: Props): {
        graticulePath: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
