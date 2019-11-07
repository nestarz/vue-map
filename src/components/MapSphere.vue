<template>
  <g v-if="!canvas">
    <defs>
      <clipPath :id="id">
        <path :d="spherePath" />
      </clipPath>
    </defs>
    <path
      :d="spherePath"
      :fill="fill"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      class="rsm-sphere"
      v-bind="$attrs"
    />
  </g>
</template>

<script lang="ts">
import { computed, inject, watch } from "@vue/composition-api";
import ContextSymbol from "./context";

export default {
  inheritAttrs: false,
  props: {
    id: { type: String, default: "rsm-sphere" },
    fill: { type: String, default: "transparent" },
    stroke: { type: String, default: "currentcolor" },
    strokeWidth: { type: Number, default: 0.5 }
  },
  setup(props: any) {
    const context = inject(ContextSymbol);
    const spherePath = computed(() => {
      if (!context) return null;

      context.update;
      return context.path({ type: "Sphere" });
    });

    watch(() => {
      // TODO: not any change
      if (!context || (context && !context.canvas) || (context && !context.svg))
        return;
      const ctx = context.svg.getContext("2d");

      const path = new Path2D(spherePath.value);
      ctx.beginPath();
      ctx.lineWidth = props.strokeWidth || 1;
      ctx.strokeStyle = props.stroke || "black";
      ctx.fillStyle = props.fill || "yellow";
      ctx.fill(path);
      ctx.stroke(path);
    });
    return {
      canvas: context && context.canvas,
      spherePath
    };
  }
};
</script>

<style scoped>
.rsm-sphere {
  pointer-events: none;
}
</style>
