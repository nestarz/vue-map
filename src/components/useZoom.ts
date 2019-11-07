import * as d3 from "d3";
import { Ref } from "@vue/composition-api";

import versor from "versor";

type Vector3 = [number, number, number];

const zoom = (
  projection: d3.GeoProjection,
  path: d3.GeoPath,
  svg: SVGSVGElement,
  update: Ref<number>
) => {
  let v0: Vector3; // Mouse position in Cartesian coordinates at start of drag gesture.
  let r0: Vector3; // Projection rotation as Euler angles at start.
  let q0: Vector3; // Projection rotation as versor at start.
  const zoomstarted = () => {
    v0 = versor.cartesian(projection.invert(d3.mouse(svg)));
    r0 = projection.rotate();
    q0 = versor(r0);
  };
  const zoomed = () => {
    projection.scale((d3.event.transform.k * (svg.clientHeight - 10)) / 10);

    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(svg))),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      r1 = versor.rotation(q1);
    projection.rotate(r1);
    update.value = Math.random();

    d3.select(svg)
      .selectAll("path")
      .each((_, i, nodes) => {
        const svgElement = nodes[i] as any;
        if (
          svgElement.__vue__ &&
          svgElement.attributes.d &&
          svgElement.__vue__.geography
        ) {
          const d = path(svgElement.__vue__.geography);
          if (d) {
            svgElement.setAttribute("d", d);
          }
        }
      });
  };
  return d3
    .zoom()
    .scaleExtent([2, 10])
    .on("start", zoomstarted)
    .on("zoom", zoomed);
};

const drag = (
  projection: d3.GeoProjection,
  path: d3.GeoPath,
  svg: SVGSVGElement,
  update: Ref<number>
) => {
  let v0: Vector3; // Mouse position in Cartesian coordinates at start of drag gesture.
  let r0: Vector3; // Projection rotation as Euler angles at start.
  let q0: Vector3; // Projection rotation as versor at start.
  const dragstarted = () => {
    const [x, y] = projection.invert(d3.mouse(svg));
    v0 = versor.cartesian([x, y]);
    r0 = projection.rotate();
    q0 = versor(r0);
    d3.select(svg)
      .selectAll(".point")
      .remove();
    d3.select(svg)
      .insert("path")
      .datum({ type: "Point", coordinates: [x, y] })
      .attr("class", "point");
    // .attr("d", (d, i, nodes) => path(nodes[i].__vue__.geography));
  };
  const dragged = () => {
    const [x, y] = projection.invert(d3.mouse(svg));
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(svg))),
      q1 = versor.multiply(q0, versor.delta(v0, v1)),
      r1 = versor.rotation(q1);
    projection.rotate(r1);
    update.value = Math.random();

    d3.select(svg)
      .selectAll(".point")
      .datum({ type: "Point", coordinates: [x, y] });
    d3.select(svg)
      .selectAll("path")
      .each((_, i, nodes) => {
        const svgElement = nodes[i] as any;
        if (
          svgElement.__vue__ &&
          svgElement.attributes.d &&
          svgElement.__vue__.geography
        ) {
          const d = path(svgElement.__vue__.geography);
          if (d) {
            svgElement.setAttribute("d", d);
          }
        }
      });
  };
  const dragended = () => {
    //emit("coord", coord.value, dragended.value);
  };
  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

export { zoom, drag };
