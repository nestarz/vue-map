import { Topology } from "topojson-specification";
declare type Props = {
    geography: string | Topology;
    parseGeographies: Function;
};
declare const _default: {
    props: {
        geography: (StringConstructor | ObjectConstructor | ArrayConstructor)[];
        parseGeographies: FunctionConstructor;
    };
    setup(props: Props, { slots, scopedSlots }: any): () => import("vue").VNode;
};
export default _default;
