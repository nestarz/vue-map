<template>
  <path :d="lineData" class="rsm-line" :stroke="stroke" :stroke-width="strokeWidth" :fill="fill" />
</template>

<script lang="ts">
import { inject, computed } from "@vue/composition-api";
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

    return {
      lineData: computed(() => {
        if (!context) return null;

        context.update;
        return context.path({
          type: "LineString",
          coordinates: props.coordinates || [props.from, props.to]
        });
      })
    };
  }
};
</script>
