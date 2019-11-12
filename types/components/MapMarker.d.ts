declare type Vector2 = [number, number];
declare type Props = {
    coordinates: Vector2;
    r: number;
    fill: string;
};
declare const _default: {
    props: {
        coordinates: {
            type: ArrayConstructor;
            required: boolean;
        };
        r: NumberConstructor;
        fill: StringConstructor;
    };
    setup(props: Props, { attrs, root, slots }: any): () => import("vue").VNode;
};
export default _default;
