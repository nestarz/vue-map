<template>
  <path :d="graticulePath" :fill="fill" :stroke="stroke" class="rsm-graticule" />
</template>

<script lang="ts">
import { computed, inject } from "@vue/composition-api";

import { geoGraticule } from "d3";

import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  fill: String;
  stroke: String;
  step: Vector2;
};

export default {
  props: {
    fill: { type: String, default: "transparent" },
    stroke: { type: String, default: "currentcolor" },
    step: { type: Array, default: () => [10, 10] }
  },
  setup(props: Props) {
    const context = inject(ContextSymbol);

    return {
      graticulePath: computed(() => {
        if (!context) return null;

        context.update;
        return context.path(geoGraticule().step(props.step)());
      })
    };
  }
};
</script>
