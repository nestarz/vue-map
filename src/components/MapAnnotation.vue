<template>
  <g :transform="translate" class="rsm-annotation" v-if="!canvas">
    <path :d="connectorPath" fill="transparent" v-bind="$attrs" />
    <slot />
  </g>
</template>

<script lang="ts">
import { createConnectorPath } from "./utils";
import { computed, inject } from "@vue/composition-api";
import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  subject: Vector2;
  dx: number;
  dy: number;
  curve: number;
};

export default {
  inheritAttrs: false,
  props: {
    subject: Array,
    dx: { type: Number, default: 30 },
    dy: { type: Number, default: 30 },
    curve: { type: Number, default: 0 }
  },
  setup(props: Props) {
    const context = inject(ContextSymbol);
    const point = computed(() => {
      if (!context) return null;

      context.update;
      if (!context.projection) return { x: 0, y: 0 };

      const [x, y] = context.projection(props.subject);
      return { x, y };
    });

    return {
      canvas: context && context.canvas,
      translate: computed(
        () =>
          `translate(${point.value.x + props.dx}, ${point.value.y + props.dy})`
      ),
      connectorPath: computed(() =>
        createConnectorPath(props.dx, props.dy, props.curve)
      )
    };
  }
};
</script>