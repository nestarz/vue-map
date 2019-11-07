import { Ref } from '@vue/composition-api';
declare const _default: {
    props: {
        color: StringConstructor;
    };
    setup(): {
        wrapper: Ref<HTMLDivElement>;
        inner: Ref<HTMLDivElement>;
        scrollThumbX: Ref<number>;
        scrollThumbY: Ref<number>;
        scrollTop: Ref<number>;
        scrollLeft: Ref<number>;
        onMousemove: () => void;
        onScroll: () => void;
        onMouseScrollStart: (e: MouseEvent, direction: ScrollDirection) => void;
    };
};
export default _default;
declare type ScrollDirection = 'x' | 'y';
