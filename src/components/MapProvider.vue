<template>
  <div class="provider">
    <slot v-bind="{path, projectionFunc}" />
  </div>
</template>

<script lang="ts">
import {
  watch,
  ref,
  computed,
  provide,
  reactive,
  Ref
} from "@vue/composition-api";

import {
  select,
  geoPath,
  geoEqualEarth,
  geoMercator,
  geoTransverseMercator,
  geoAlbers,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoOrthographic,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  GeoProjection,
  GeoRawProjection,
  GeoPath,
  GeoConicProjection,
  GeoStreamWrapper
} from "d3";

const projections: Projections = {
  geoEqualEarth,
  geoMercator,
  geoTransverseMercator,
  geoAlbers,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoOrthographic,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant
};

import { zoom, drag } from "./useZoom";

import ContextSymbol from "./context";

type ProjectionConfig = {
  center: [number, number] | null;
  rotate: [number, number] | null;
  scale: number | null;
  parallels: [number, number] | null;
  [key: string]: any;
};

type Props = {
  width: number;
  height: number;
  projection: string | Function;
  projectionConfig: ProjectionConfig;
  svg: SVGSVGElement;
  canvas: Boolean
};

type Projections = {
  [key: string]: Function;
};

type ProviderProjection = string | Function;

type AnyProjection = GeoProjection | GeoConicProjection;

//const isProjection = (x: Function): x is GeoProjection => fruit.includes(x);

const makeProjection = (projectionFunc: ProviderProjection): AnyProjection => {
  const projection = projectionFunc as AnyProjection;

  if (typeof projection === "string" && projection in projections) {
    let proj = projections[projection]();
    return proj;
  }

  throw Error(
    "Unknown projection, choose one supported or provide one as a function."
  );
};

const configurateProjection = (
  projection: AnyProjection,
  projectionConfig: ProjectionConfig,
  width: number = 800,
  height: number = 500
) => {
  projection.translate([width / 2, height / 2]);

  if (projectionConfig) {
    ["center", "rotate", "scale", "parralel"].forEach(funcName => {
      if (funcName in projection) {
        // @ts-ignore: Unreachable code error
        const func = projection[funcName];
        func(projectionConfig[funcName] || func())
      }
    })
  }
};

export default {
  props: {
    width: Number,
    height: Number,
    projection: [String, Function],
    projectionConfig: Object,
    svg: SVGSVGElement,
    canvas: Boolean
  },
  setup(props: Props) {
    const svg = computed(() => props.svg);
    const projectionConfig = computed(() => props.projectionConfig);
    const projectionName = computed(() => props.projection);
    const width = computed(() => props.width);
    const height = computed(() => props.height);

    const projectionFunc: Ref<GeoProjection | null> = ref(null);
    const path = computed((): GeoPath | null =>
      geoPath().projection(projectionFunc.value)
    );
    const update: Ref<number> = ref(0);

    provide(
      ContextSymbol,
      reactive({
        projection: projectionFunc,
        canvas: props.canvas,
        svg,
        path,
        update
      })
    );

    watch([projectionName], () => {
      projectionFunc.value = makeProjection(projectionName.value);
      update.value = Math.random();
    });

    watch([projectionFunc, projectionConfig, width, height], () => {
      configurateProjection(
        projectionFunc.value,
        projectionConfig.value,
        width.value,
        height.value
      );
      update.value = Math.random();
    });

    watch([svg], () => {
      select(svg.value).call(
        drag(projectionFunc.value, path.value, svg.value, update)
      );
      select(svg.value).call(
        zoom(projectionFunc.value, path.value, svg.value, update)
      );
    });

    return {
      path,
      projectionFunc
    };
  }
};
</script>

<style>
</style>
