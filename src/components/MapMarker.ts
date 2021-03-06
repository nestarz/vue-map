import { computed, inject, watch, onMounted, createElement as h } from "@vue/composition-api";
import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  coordinates: Vector2;
  r: number;
  fill: string;
};

export default {
  props: {
    coordinates: { type: Array, required: true },
    r: Number,
    fill: String
  },
  setup(props: Props, { attrs, root, slots }: any) {
    const context = inject(ContextSymbol);

    const point = computed(() => {
      if (!context) return { x: 0, y: 0 };

      context.update;
      const [x, y] = context.projection(props.coordinates);
      return { x, y };
    });

    const update = computed(() => context && context.update);
    watch([update, () => props], () => {
      if (!context || (context && !context.canvas) || (context && !context.svg))
        return;

      root.$nextTick(() => {
        const ctx = context.svg.getContext("2d");
        ctx.beginPath();
        const radius = attrs.r || 5;
        ctx.arc(point.value.x, point.value.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = attrs.fill || 'black';
        ctx.fill();
      });
    });

    onMounted(() => {
      if (!context) return;
      setTimeout(() => (context.update = Math.random()), 100); // hack
    });

    if (context && !context.canvas) {
      const transform = computed(() => `translate(${point.value.x}, ${point.value.y})`);
      return () => h('g', { class: 'vue-map-marker', attrs: { transform: transform.value } }, [slots.default()])
    }
  }
};
