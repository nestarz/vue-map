import { InjectionKey } from "@vue/composition-api";

import { GeoProjection, GeoPath } from "d3";

type Context = {
  path: GeoPath;
  projection: GeoProjection;
  update: number;
};

const ContextSymbol: InjectionKey<Context> = Symbol();

export default ContextSymbol;
