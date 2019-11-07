<template>
  <path
    :d="lineData"
    class="rsm-line"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :fill="fill"
    v-if="!canvas"
  />
</template>

<script lang="ts">
import { inject, computed, watch } from "@vue/composition-api";
import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  from: Vector2;
  to: Vector2;
  coordinates: [Vector2, Vector2];
  stroke: string;
  strokeWidth: number;
  fill: string;
};

export default {
  props: {
    from: { type: Array, default: () => [0, 0] },
    to: { type: Array, default: () => [0, 0] },
    coordinates: Array,
    stroke: { type: String, default: "currentcolor" },
    strokeWidth: { type: Number, default: 3 },
    fill: { type: String, default: "transparent" }
  },
  setup(props: Props) {
    const context = inject(ContextSymbol);
    const lineData = computed(() => {
      if (!context) return null;

      context.update;
      return context.path({
        type: "LineString",
        coordinates: props.coordinates || [props.from, props.to]
      });
    });

    watch(() => {
      // TODO: not any change
      if(!context || context && !context.canvas || context && !context.svg) return;
      const ctx = context.svg.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = props.stroke;
      ctx.lineWidth = props.strokeWidth;
      ctx.fillStyle = props.stroke
      const path = new Path2D(lineData.value);
      ctx.stroke(path);
    });
    return {
      canvas: context && context.canvas,
      lineData
    };
  }
};
</script>
