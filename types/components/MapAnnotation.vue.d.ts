declare type Vector2 = [number, number];
declare type Props = {
    subject: Vector2;
    dx: number;
    dy: number;
    curve: number;
};
declare const _default: {
    inheritAttrs: boolean;
    props: {
        subject: ArrayConstructor;
        dx: {
            type: NumberConstructor;
            default: number;
        };
        dy: {
            type: NumberConstructor;
            default: number;
        };
        curve: {
            type: NumberConstructor;
            default: number;
        };
    };
    setup(props: Props): {
        translate: import("@vue/composition-api").Ref<string>;
        connectorPath: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
