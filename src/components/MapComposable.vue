<template>
  <map-provider
    :width="width"
    :height="height"
    :projection="projection"
    :projectionConfig="projectionConfig"
    :svg="svg"
    :canvas="canvas"
    ref="parent"
    style="position: relative; height: 100%; width: 100%;"
  >
    <div style="position: absolute; top: 0; right: 0; left: 0; bottom: 0;">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="xMidYMid meet"
        class="rsm-svg"
        v-bind="$attrs"
        ref="svg"
        v-if="!canvas"
        style="height: 100%; width: 100%"
      >
        <slot />
      </svg>
      <canvas :width="width" :height="height" ref="svg" style="height: 100%; width: 100%" v-else>
        <slot />
      </canvas>
    </div>
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
    const svg: Ref<SVGSVGElement | HTMLCanvasElement> = ref(null);
    const parent: any = ref(null);
    const width = ref(0);
    const height = ref(0);
    const setSize = () => {
      height.value = svg.value.getBoundingClientRect().height;
      width.value = svg.value.getBoundingClientRect().width;
    };
    // @ts-ignore: Unreachable code error
    const resizeObserver = window.ResizeObserver && new ResizeObserver(setSize);
    watch([parent, svg], () => {
      if (!parent.value || !svg.value) return;

      setSize();
      resizeObserver && resizeObserver.observe(parent.value.$el);
    });
    // @ts-ignore: Unreachable code error
    if (!window.ResizeObserver) {
      setTimeout(setSize, 10);
      window.addEventListener("resize", setSize, true);
    }

    return {
      svg,
      parent,
      width,
      height
    };
  }
};
</script>