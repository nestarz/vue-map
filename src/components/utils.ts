import { feature } from "topojson-client";

import { Topology, GeometryObject } from "topojson-specification";
import { GeoPath } from "d3";
import * as GeoJSON from "geojson";

export function fetchGeographies(url: string) {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .catch(error => {
      console.log("There was a problem when fetching the data: ", error);
    });
}

const isCollection = (
  collectionOrFeature:
    | GeoJSON.FeatureCollection<GeoJSON.GeometryObject>
    | GeoJSON.Feature<GeoJSON.GeometryObject>
): collectionOrFeature is GeoJSON.FeatureCollection<GeoJSON.GeometryObject> =>
  collectionOrFeature.hasOwnProperty("features");

export function getFeatures(geographies: Topology, parseGeographies: Function) {
  if (Array.isArray(geographies))
    return parseGeographies ? parseGeographies(geographies) : geographies;

  const object: GeometryObject =
    geographies.objects[Object.keys(geographies.objects)[0]];
  const collection = feature(geographies, object);
  if (isCollection(collection)) {
    return parseGeographies
      ? parseGeographies(collection.features)
      : collection.features;
  }
  throw Error("GeometryObject must be a GeometryCollection.")
}

export function prepareFeatures(
  features: Array<GeoJSON.Feature>,
  path: GeoPath
) {
  return features
    ? features.map((d, i) => {
        return {
          ...d,
          rsmKey: `geo-${i}`,
          svgPath: path(d)
        };
      })
    : [];
}

export function createConnectorPath(dx = 30, dy = 30, curve = 0.5) {
  const curvature = Array.isArray(curve) ? curve : [curve, curve];
  const curveX = (dx / 2) * curvature[0];
  const curveY = (dy / 2) * curvature[1];
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
}

export function isString(geo: string | Topology): geo is string {
  return typeof geo === "string";
}

export const ContextSymbol = Symbol();
