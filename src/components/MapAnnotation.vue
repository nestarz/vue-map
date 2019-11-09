<template>
  <g :transform="translate" class="rsm-annotation" v-if="!canvas">
    <path :d="connectorPath" fill="transparent" v-bind="$attrs" />
    <slot />
  </g>
</template>

<script lang="ts">
import { createConnectorPath } from "./utils";
import { computed, inject, watch, onMounted } from "@vue/composition-api";
import ContextSymbol from "./context";

type Vector2 = [number, number];
type Props = {
  subject: Vector2;
  dx: number;
  dy: number;
  curve: number;
  text: string;
  textSize: string;
  textFamily: string;
  textColor: string;
};

export default {
  inheritAttrs: false,
  props: {
    subject: Array,
    dx: { type: Number, default: 30 },
    dy: { type: Number, default: 30 },
    curve: { type: Number, default: 0 },
    text: { type: String },
    textSize: { type: String, default: "15px" },
    textFamily: { type: String, default: "Arial" },
    textColor: { type: String, default: "black" },
  },
  setup(props: Props, { root, attrs }: any) {
    const context = inject(ContextSymbol);
    const point = computed(() => {
      if (!context) return null;

      context.update;
      if (!context.projection) return { x: 0, y: 0 };

      const [x, y] = context.projection(props.subject);
      return { x, y };
    });

    const update = computed(() => context && context.update);
    watch([update, () => props.text], () => {
      root.$nextTick(() => {
        if (!props.text) return;
        if (
          !context ||
          (context && !context.canvas) ||
          (context && !context.svg)
        )
          return;

        const ctx = context.svg.getContext("2d");
        ctx.font = `${props.textSize} ${props.textFamily}`;
        ctx.fillStyle = props.textColor;
        ctx.fillText(props.text, point.value.x + props.dx, point.value.y + props.dy);
      });
    });

    onMounted(() => {
      if (!context) return;
      setTimeout(() => (context.update = Math.random()), 100); // hack
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