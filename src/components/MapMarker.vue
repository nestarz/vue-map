<template>
  <g class="rsm-marker" :transform="transform">
    <slot />
  </g>
</template>

<script lang="ts">
import { computed, inject } from "@vue/composition-api";
import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  coordinates: Vector2
}

export default {
  props: {
    coordinates: { type: Array, required: true }
  },
  setup(props: Props) {
    const context = inject(ContextSymbol);

    return {
      transform: computed(() => {
        if(!context) return null;

        context.update;
        const [x, y] = context.projection(props.coordinates);
        return `translate(${x}, ${y})`;
      })
    };
  }
};
</script>
