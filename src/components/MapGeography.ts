import { inject, watch, computed, createElement as h } from "@vue/composition-api";
import ContextSymbol from "./context";

export default {
  props: {
    geography: { type: Object, required: true }
  },
  setup(props: any, { attrs, slots }: any) {
    const context = inject(ContextSymbol);

    const update = computed(() => context && context.update);

    watch([update, () => props.geography], () => {
      // TODO: not any change
      if (!context || (context && !context.canvas) || (context && !context.svg))
        return;

      const path = new Path2D(props.geography.svgPath);

      const ctx = context.svg.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = attrs.stroke || "black";
      ctx.lineWidth = attrs.strokeWidth || 1;
      ctx.fillStyle = attrs.fill || "black";
      ctx.fill(path);
      ctx.stroke(path);
    });

    if (context && !context.canvas) {
      return () => h('path', { class: 'vue-map-geography', attrs: { role: 'geography', d: props.geography.svgPath, ...attrs } })
    }
  }
};
