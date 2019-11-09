<template>
  <path
    :d="graticulePath"
    class="rsm-graticule"
    stroke="black" 
    stroke-width="1"
    v-bind="$attrs"
    v-if="!canvas"
  />
</template>

<script lang="ts">
import { computed, inject, watch } from "@vue/composition-api";

import { geoGraticule } from "d3";

import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  step: Vector2;
};

export default {
  props: {
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
      if (!context || (context && !context.canvas) || (context && !context.svg))
        return;
      const ctx = context.svg.getContext("2d");

      const path = new Path2D(graticulePath.value);
      ctx.beginPath();
      ctx.lineWidth = attrs["stroke-width"] || 1;
      ctx.strokeStyle = attrs.stroke || "black";
      ctx.fillStyle = attrs.fill || "yellow";
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
