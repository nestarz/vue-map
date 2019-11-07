<template>
  <map-provider
    :width="width"
    :height="height"
    :projection="projection"
    :projectionConfig="projectionConfig"
    :svg="svg"
    :canvas="canvas"
    ref="parent"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="xMidYMid meet"
      class="rsm-svg"
      v-bind="$attrs"
      ref="svg"
      v-if="!canvas"
    >
      <slot />
    </svg>
    <canvas :width="width" :height="height" ref="svg" v-else>
      <slot />
    </canvas>
  </map-provider>
</template>

<script lang="ts">
import { ref, watch, Ref, computed } from "@vue/composition-api";

import mapProvider from "./MapProvider.vue";

export default {
  components: {
    mapProvider
  },
  inheritAttrs: false,
  props: {
    projection: { type: [String, Function], default: "geoEqualEarth" },
    projectionConfig: { type: Object, default: () => {} },
    canvas: Boolean
  },
  setup() {
    const svg: Ref<SVGSVGElement> = ref(null);
    const parent: any = ref(null);
    const width = ref(0);
    const height = ref(0);
    const setSize = () => {
      height.value = parent.value.$el.offsetHeight;
      width.value = parent.value.$el.offsetWidth;
    };
    // @ts-ignore: Unreachable code error
    const resizeObserver = new ResizeObserver(setSize);
    watch(parent, () => {
      if (!parent.value) return;
      setSize();
      resizeObserver.observe(parent.value.$el);
    });
    return {
      svg,
      parent,
      width,
      height
    };
  }
};
</script>