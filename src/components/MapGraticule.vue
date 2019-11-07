<template>
  <path :d="graticulePath" :fill="fill" :stroke="stroke" class="rsm-graticule" v-if="!canvas" />
</template>

<script lang="ts">
import { computed, inject, watch } from "@vue/composition-api";

import { geoGraticule } from "d3";

import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  fill: String;
  stroke: String;
  strokeWidth: number;
  step: Vector2;
};

export default {
  props: {
    fill: { type: String, default: "transparent" },
    stroke: { type: String, default: "currentcolor" },
    strokeWidth: { type: Number, default: 1 },
    step: { type: Array, default: () => [10, 10] }
  },
  setup(props: Props, { attrs }: any) {
    const context = inject(ContextSymbol);
    const graticulePath = computed(() => {
      if (!context) return null;

      context.update;
      return context.path(geoGraticule().step(props.step)());
    });

    watch(() => {
      // TODO: not any change
      if(!context || context && !context.canvas || context && !context.svg) return;
      const ctx = context.svg.getContext("2d");
      
      const path = new Path2D(graticulePath.value);
      ctx.beginPath();
      ctx.lineWidth = props.strokeWidth || 1;
      ctx.strokeStyle = props.stroke || "black";
      ctx.fillStyle = props.fill || "yellow";
      ctx.fill(path);
      ctx.stroke(path);
    });
    return {
      canvas: context && context.canvas,
      graticulePath
    };
  }
};
</script>
