declare type Vector2 = [number, number];
declare type Props = {
    coordinates: Vector2;
};
declare const _default: {
    props: {
        coordinates: {
            type: ArrayConstructor;
            required: boolean;
        };
    };
    setup(props: Props): {
        canvas: any;
        transform: import("@vue/composition-api").Ref<string>;
    };
};
export default _default;
