declare type Vector2 = [number, number];
declare type Props = {
    from: Vector2;
    to: Vector2;
    coordinates: [Vector2, Vector2];
    stroke: string;
    strokeWidth: number;
    fill: string;
};
declare const _default: {
    props: {
        from: {
            type: ArrayConstructor;
            default: () => number[];
        };
        to: {
            type: ArrayConstructor;
            default: () => number[];
        };
        coordinates: ArrayConstructor;
        stroke: {
            type: StringConstructor;
            default: string;
        };
        strokeWidth: {
            type: NumberConstructor;
            default: number;
        };
        fill: {
            type: StringConstructor;
            default: string;
        };
    };
    setup(props: Props): {
        lineData: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
