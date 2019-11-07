<template>
  <g class="rsm-geographies">
    <slot v-bind="{geographies}" />
  </g>
</template>

<script lang="ts">
import {
  watch,
  ref,
  computed,
  onMounted,
  inject,
  Ref
} from "@vue/composition-api";
import { Topology, GeometryObject } from "topojson-specification";

import {
  fetchGeographies,
  getFeatures,
  prepareFeatures,
  isString
} from "./utils";

import ContextSymbol from "./context";

type Props = {
  geography: string | Topology;
  parseGeographies: Function;
};

export default {
  props: {
    geography: [String, Object, Array],
    parseGeographies: Function
  },
  setup(props: Props) {
    const context = inject(ContextSymbol);

    const features: Ref<Array<GeoJSON.Feature>> = ref(null);
    const geography = computed(() => props.geography);
    const geographies = computed(() => {
      if (!context) return null;
      context.update;
      return prepareFeatures(features.value, context.path);
    });

    const setup = () => {
      if (typeof window === `undefined`) return;

      if (isString(geography.value)) {
        fetchGeographies(geography.value).then(geos => {
          if (geos) features.value = getFeatures(geos, props.parseGeographies);
        });
      } else {
        features.value = getFeatures(geography.value, props.parseGeographies);
      }
    };

    watch(geography, setup);
    onMounted(setup);

    const update = computed(() => context && context.update);
    watch(update, () => {
      if (!context || (context && !context.canvas) || (context && !context.svg))
        return;

      const ctx = context.svg.getContext("2d");

      ctx.clearRect(0, 0, context.svg.width, context.svg.height);
    });

    return {
      geographies
    };
  }
};
</script>
