<template>
  <path
    role="geography"
    class="rsm-geography"
    :d="geography.svgPath"
    v-bind="$attrs"
    v-if="!canvas"
  >
    <slot />
  </path>
</template>

<script>
import { inject, watch } from "@vue/composition-api";
import ContextSymbol from "./context.ts";

export default {
  props: {
    geography: { type: Object, required: true }
  },
  setup(props, { attrs }) {
    const context = inject(ContextSymbol);

    watch(() => {
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
    return {
      canvas: context.canvas
    };
  }
};
</script>