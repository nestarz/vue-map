import {
  watch,
  ref,
  computed,
  inject,
  createElement as h,
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
  setup(props: Props, { slots, scopedSlots }: any) {
    const context = inject(ContextSymbol);

    const features: Ref<Array<GeoJSON.Feature>> = ref(null);
    const geography = computed(() => props.geography);
    const geographies = computed(() => {
      if (!context) return null;
      context.update;

      return prepareFeatures(features.value, context.path);
    });

    const setup = () => {
      if (isString(geography.value)) {
        fetchGeographies(geography.value).then(geos => {
          if (geos) features.value = getFeatures(geos, props.parseGeographies);
        });
      } else {
        features.value = getFeatures(geography.value, props.parseGeographies);
      }
    };

    watch(geography, setup);

    if (context && !context.canvas) {
      return () => h('g', { class: 'vue-map-geographies' }, [slots.default({
        geographies: geographies.value
      })])
    }
    
    return () => h('g', slots.default({
      geographies: geographies.value
    }))
  }
};
