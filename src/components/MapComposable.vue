<template>
  <map-provider
    :width="width"
    :height="height"
    :projection="projection"
    :projectionConfig="projectionConfig"
    :svg="svg"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="xMidYMid meet"
      class="rsm-svg"
      v-bind="$attrs"
      ref="svg"
    >
      <slot />
    </svg>
  </map-provider>
</template>

<script lang="ts">
import { ref, Ref } from "@vue/composition-api";

import mapProvider from "./MapProvider.vue";

export default {
  components: {
    mapProvider
  },
  inheritAttrs: false,
  props: {
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    projection: { type: [String, Function], default: "geoEqualEarth" },
    projectionConfig: { type: Object, default: () => {} }
  },
  setup() {
    const svg: Ref<SVGSVGElement> = ref(null);
    return {
      svg
    };
  }
};
</script>