declare type Vector2 = [number, number];
declare type Props = {
    subject: Vector2;
    dx: number;
    dy: number;
    curve: number;
    text: string;
    textSize: string;
    textFamily: string;
    textColor: string;
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
        text: {
            type: StringConstructor;
        };
        textSize: {
            type: StringConstructor;
            default: string;
        };
        textFamily: {
            type: StringConstructor;
            default: string;
        };
        textColor: {
            type: StringConstructor;
            default: string;
        };
    };
    setup(props: Props, { root, attrs }: any): {
        canvas: any;
        translate: import("@vue/composition-api").Ref<string>;
        connectorPath: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
