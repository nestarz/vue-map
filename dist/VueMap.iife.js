var VueMap = (function (exports, VueCompositionApi, d3) {
  'use strict';

  var VueCompositionApi__default = 'default' in VueCompositionApi ? VueCompositionApi['default'] : VueCompositionApi;

  var acos = Math.acos,
      asin = Math.asin,
      atan2 = Math.atan2,
      cos = Math.cos,
      max = Math.max,
      min = Math.min,
      PI = Math.PI,
      sin = Math.sin,
      sqrt = Math.sqrt,
      radians = PI / 180,
      degrees = 180 / PI;

  // Returns the unit quaternion for the given Euler rotation angles [λ, φ, γ].
  var versor = function(e) {
    var l = e[0] / 2 * radians, sl = sin(l), cl = cos(l), // λ / 2
        p = e[1] / 2 * radians, sp = sin(p), cp = cos(p), // φ / 2
        g = e[2] / 2 * radians, sg = sin(g), cg = cos(g); // γ / 2
    return [
      cl * cp * cg + sl * sp * sg,
      sl * cp * cg - cl * sp * sg,
      cl * sp * cg + sl * cp * sg,
      cl * cp * sg - sl * sp * cg
    ];
  };

  // Returns Cartesian coordinates [x, y, z] given spherical coordinates [λ, φ].
  versor.cartesian = function(e) {
    var l = e[0] * radians, p = e[1] * radians, cp = cos(p);
    return [cp * cos(l), cp * sin(l), sin(p)];
  };

  // Returns the Euler rotation angles [λ, φ, γ] for the given quaternion.
  versor.rotation = function(q) {
    return [
      atan2(2 * (q[0] * q[1] + q[2] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2])) * degrees,
      asin(max(-1, min(1, 2 * (q[0] * q[2] - q[3] * q[1])))) * degrees,
      atan2(2 * (q[0] * q[3] + q[1] * q[2]), 1 - 2 * (q[2] * q[2] + q[3] * q[3])) * degrees
    ];
  };

  // Returns the quaternion to rotate between two cartesian points on the sphere.
  // alpha for tweening [0,1]
  versor.delta = function(v0, v1, alpha) {
    if (arguments.length == 2) alpha = 1;
    var w = cross(v0, v1), l = sqrt(dot(w, w));
    if (!l) return [1, 0, 0, 0];
    var t = alpha * acos(max(-1, min(1, dot(v0, v1)))) / 2, s = sin(t); // t = θ / 2
    return [cos(t), w[2] / l * s, -w[1] / l * s, w[0] / l * s];
  };

  // Returns the quaternion that represents q0 * q1.
  versor.multiply = function(q0, q1) {
    return [
      q0[0] * q1[0] - q0[1] * q1[1] - q0[2] * q1[2] - q0[3] * q1[3],
      q0[0] * q1[1] + q0[1] * q1[0] + q0[2] * q1[3] - q0[3] * q1[2],
      q0[0] * q1[2] - q0[1] * q1[3] + q0[2] * q1[0] + q0[3] * q1[1],
      q0[0] * q1[3] + q0[1] * q1[2] - q0[2] * q1[1] + q0[3] * q1[0]
    ];
  };

  function cross(v0, v1) {
    return [
      v0[1] * v1[2] - v0[2] * v1[1],
      v0[2] * v1[0] - v0[0] * v1[2],
      v0[0] * v1[1] - v0[1] * v1[0]
    ];
  }

  function dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
  }

  const zoom = (projection, path, svg, update) => {
      let v0; // Mouse position in Cartesian coordinates at start of drag gesture.
      let r0; // Projection rotation as Euler angles at start.
      let q0; // Projection rotation as versor at start.
      const zoomstarted = () => {
          v0 = versor.cartesian(projection.invert(d3.mouse(svg)));
          r0 = projection.rotate();
          q0 = versor(r0);
      };
      const zoomed = () => {
          projection.scale((d3.event.transform.k * (svg.clientHeight - 10)) / 10);
          var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(svg))), q1 = versor.multiply(q0, versor.delta(v0, v1)), r1 = versor.rotation(q1);
          projection.rotate(r1);
          update.value = Math.random();
          d3.select(svg)
              .selectAll("path")
              .each((_, i, nodes) => {
              const svgElement = nodes[i];
              if (svgElement.__vue__ &&
                  svgElement.attributes.d &&
                  svgElement.__vue__.geography) {
                  const d = path(svgElement.__vue__.geography);
                  if (d) {
                      svgElement.setAttribute("d", d);
                  }
              }
          });
      };
      return d3.zoom()
          .scaleExtent([2, 10])
          .on("start", zoomstarted)
          .on("zoom", zoomed);
  };
  const drag = (projection, path, svg, update) => {
      let v0; // Mouse position in Cartesian coordinates at start of drag gesture.
      let r0; // Projection rotation as Euler angles at start.
      let q0; // Projection rotation as versor at start.
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
          var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(svg))), q1 = versor.multiply(q0, versor.delta(v0, v1)), r1 = versor.rotation(q1);
          projection.rotate(r1);
          update.value = Math.random();
          d3.select(svg)
              .selectAll(".point")
              .datum({ type: "Point", coordinates: [x, y] });
          d3.select(svg)
              .selectAll("path")
              .each((_, i, nodes) => {
              const svgElement = nodes[i];
              if (svgElement.__vue__ &&
                  svgElement.attributes.d &&
                  svgElement.__vue__.geography) {
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
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
  };

  const ContextSymbol = Symbol();

  const projections = {
      geoEqualEarth: d3.geoEqualEarth,
      geoMercator: d3.geoMercator,
      geoTransverseMercator: d3.geoTransverseMercator,
      geoAlbers: d3.geoAlbers,
      geoAzimuthalEqualArea: d3.geoAzimuthalEqualArea,
      geoAzimuthalEquidistant: d3.geoAzimuthalEquidistant,
      geoOrthographic: d3.geoOrthographic,
      geoConicConformal: d3.geoConicConformal,
      geoConicEqualArea: d3.geoConicEqualArea,
      geoConicEquidistant: d3.geoConicEquidistant
  };
  //const isProjection = (x: Function): x is GeoProjection => fruit.includes(x);
  const makeProjection = (projectionFunc) => {
      const projection = projectionFunc;
      if (typeof projection === "string" && projection in projections) {
          let proj = projections[projection]();
          return proj;
      }
      throw Error("Unknown projection, choose one supported or provide one as a function.");
  };
  const configurateProjection = (projection, projectionConfig, width = 800, height = 500) => {
      projection.translate([width / 2, height / 2]);
      if (projectionConfig) {
          ["center", "rotate", "scale", "parralel"].forEach(funcName => {
              if (funcName in projection) {
                  // @ts-ignore: Unreachable code error
                  const func = projection[funcName];
                  func(projectionConfig[funcName] || func());
              }
          });
      }
  };
  var script = {
      props: {
          width: Number,
          height: Number,
          projection: [String, Function],
          projectionConfig: Object,
          svg: SVGSVGElement,
          canvas: Boolean
      },
      setup(props) {
          const svg = VueCompositionApi.computed(() => props.svg);
          const projectionConfig = VueCompositionApi.computed(() => props.projectionConfig);
          const projectionName = VueCompositionApi.computed(() => props.projection);
          const width = VueCompositionApi.computed(() => props.width);
          const height = VueCompositionApi.computed(() => props.height);
          const projectionFunc = VueCompositionApi.ref(null);
          const path = VueCompositionApi.computed(() => d3.geoPath().projection(projectionFunc.value));
          const update = VueCompositionApi.ref(0);
          VueCompositionApi.provide(ContextSymbol, VueCompositionApi.reactive({
              projection: projectionFunc,
              canvas: props.canvas,
              svg,
              path,
              update
          }));
          VueCompositionApi.watch([projectionName], () => {
              projectionFunc.value = makeProjection(projectionName.value);
              update.value = Math.random();
          });
          VueCompositionApi.watch([projectionFunc, projectionConfig, width, height], () => {
              configurateProjection(projectionFunc.value, projectionConfig.value, width.value, height.value);
              update.value = Math.random();
          });
          VueCompositionApi.watch([svg], () => {
              d3.select(svg.value).call(drag(projectionFunc.value, path.value, svg.value, update));
              d3.select(svg.value).call(zoom(projectionFunc.value, path.value, svg.value, update));
          });
          return {
              path,
              projectionFunc
          };
      }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  /* script */
  const __vue_script__ = script;
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "provider" },
      [
        _vm._t("default", null, null, {
          path: _vm.path,
          projectionFunc: _vm.projectionFunc
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var mapProvider = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$1 = {
      components: {
          mapProvider
      },
      inheritAttrs: false,
      props: {
          projection: { type: [String, Function], default: "geoEqualEarth" },
          projectionConfig: { type: Object, default: () => { } },
          canvas: Boolean
      },
      setup() {
          const svg = VueCompositionApi.ref(null);
          const parent = VueCompositionApi.ref(null);
          const width = VueCompositionApi.ref(0);
          const height = VueCompositionApi.ref(0);
          const setSize = () => {
              height.value = parent.value.$el.offsetHeight;
              width.value = parent.value.$el.offsetWidth;
          };
          // @ts-ignore: Unreachable code error
          const resizeObserver = window.ResizeObserver && new ResizeObserver(setSize);
          VueCompositionApi.watch(parent, () => {
              if (!parent.value)
                  return;
              setSize();
              resizeObserver && resizeObserver.observe(parent.value.$el);
          });
          // @ts-ignore: Unreachable code error
          if (!window.ResizeObserver) {
              setTimeout(setSize, 10);
              window.addEventListener('resize', setSize, true);
          }
          return {
              svg,
              parent,
              width,
              height
          };
      }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "map-provider",
      {
        ref: "parent",
        attrs: {
          width: _vm.width,
          height: _vm.height,
          projection: _vm.projection,
          projectionConfig: _vm.projectionConfig,
          svg: _vm.svg,
          canvas: _vm.canvas
        }
      },
      [
        !_vm.canvas
          ? _c(
              "svg",
              _vm._b(
                {
                  ref: "svg",
                  staticClass: "rsm-svg",
                  attrs: {
                    viewBox: "0 0 " + _vm.width + " " + _vm.height,
                    preserveAspectRatio: "xMidYMid meet"
                  }
                },
                "svg",
                _vm.$attrs,
                false
              ),
              [_vm._t("default")],
              2
            )
          : _c(
              "canvas",
              { ref: "svg", attrs: { width: _vm.width, height: _vm.height } },
              [_vm._t("default")],
              2
            )
      ]
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapComposable = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  function identity(x) {
    return x;
  }

  function transform(transform) {
    if (transform == null) return identity;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(input, i) {
      if (!i) x0 = y0 = 0;
      var j = 2, n = input.length, output = new Array(n);
      output[0] = (x0 += input[0]) * kx + dx;
      output[1] = (y0 += input[1]) * ky + dy;
      while (j < n) output[j] = input[j], ++j;
      return output;
    };
  }

  function reverse(array, n) {
    var t, j = array.length, i = j - n;
    while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
  }

  function feature(topology, o) {
    if (typeof o === "string") o = topology.objects[o];
    return o.type === "GeometryCollection"
        ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
        : feature$1(topology, o);
  }

  function feature$1(topology, o) {
    var id = o.id,
        bbox = o.bbox,
        properties = o.properties == null ? {} : o.properties,
        geometry = object(topology, o);
    return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
        : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
        : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
  }

  function object(topology, o) {
    var transformPoint = transform(topology.transform),
        arcs = topology.arcs;

    function arc(i, points) {
      if (points.length) points.pop();
      for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
        points.push(transformPoint(a[k], k));
      }
      if (i < 0) reverse(points, n);
    }

    function point(p) {
      return transformPoint(p);
    }

    function line(arcs) {
      var points = [];
      for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
      if (points.length < 2) points.push(points[0]); // This should never happen per the specification.
      return points;
    }

    function ring(arcs) {
      var points = line(arcs);
      while (points.length < 4) points.push(points[0]); // This may happen if an arc has only two points.
      return points;
    }

    function polygon(arcs) {
      return arcs.map(ring);
    }

    function geometry(o) {
      var type = o.type, coordinates;
      switch (type) {
        case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
        case "Point": coordinates = point(o.coordinates); break;
        case "MultiPoint": coordinates = o.coordinates.map(point); break;
        case "LineString": coordinates = line(o.arcs); break;
        case "MultiLineString": coordinates = o.arcs.map(line); break;
        case "Polygon": coordinates = polygon(o.arcs); break;
        case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
        default: return null;
      }
      return {type: type, coordinates: coordinates};
    }

    return geometry(o);
  }

  function fetchGeographies(url) {
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
  const isCollection = (collectionOrFeature) => collectionOrFeature.hasOwnProperty("features");
  function getFeatures(geographies, parseGeographies) {
      if (Array.isArray(geographies))
          return parseGeographies ? parseGeographies(geographies) : geographies;
      const object = geographies.objects[Object.keys(geographies.objects)[0]];
      const collection = feature(geographies, object);
      if (isCollection(collection)) {
          return parseGeographies
              ? parseGeographies(collection.features)
              : collection.features;
      }
      throw Error("GeometryObject must be a GeometryCollection.");
  }
  function prepareFeatures(features, path) {
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
  function createConnectorPath(dx = 30, dy = 30, curve = 0.5) {
      const curvature = Array.isArray(curve) ? curve : [curve, curve];
      const curveX = (dx / 2) * curvature[0];
      const curveY = (dy / 2) * curvature[1];
      return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
  }
  function isString(geo) {
      return typeof geo === "string";
  }

  var script$2 = {
      props: {
          geography: [String, Object, Array],
          parseGeographies: Function
      },
      setup(props) {
          const context = VueCompositionApi.inject(ContextSymbol);
          const features = VueCompositionApi.ref(null);
          const geography = VueCompositionApi.computed(() => props.geography);
          const geographies = VueCompositionApi.computed(() => {
              if (!context)
                  return null;
              context.update;
              return prepareFeatures(features.value, context.path);
          });
          const setup = () => {
              if (typeof window === `undefined`)
                  return;
              if (isString(geography.value)) {
                  fetchGeographies(geography.value).then(geos => {
                      if (geos)
                          features.value = getFeatures(geos, props.parseGeographies);
                  });
              }
              else {
                  features.value = getFeatures(geography.value, props.parseGeographies);
              }
          };
          VueCompositionApi.watch(geography, setup);
          VueCompositionApi.onMounted(setup);
          const update = VueCompositionApi.computed(() => context && context.update);
          VueCompositionApi.watch(update, () => {
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

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "g",
      { staticClass: "rsm-geographies" },
      [_vm._t("default", null, null, { geographies: _vm.geographies })],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapGeographies = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$3 = {
    props: {
      geography: { type: Object, required: true }
    },
    setup(props, { attrs }) {
      const context = VueCompositionApi.inject(ContextSymbol);

      VueCompositionApi.watch(() => {
        // TODO: not any change
        if (!context || (context && !context.canvas) || (context && !context.svg))
          return;

        const path = new Path2D(props.geography.svgPath);
        
        const ctx = context.svg.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = attrs.stroke || "black";
        ctx.lineWidth = attrs.strokeWidth || 1;
        ctx.fillStyle = attrs.fill || "black";
        ctx.fill(path);
        ctx.stroke(path);
      });
      return {
        canvas: context.canvas
      };
    }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return !_vm.canvas
      ? _c(
          "path",
          _vm._b(
            {
              staticClass: "rsm-geography",
              attrs: { role: "geography", d: _vm.geography.svgPath }
            },
            "path",
            _vm.$attrs,
            false
          ),
          [_vm._t("default")],
          2
        )
      : _vm._e()
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapGeography = normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$4 = {
      props: {
          fill: { type: String, default: "transparent" },
          stroke: { type: String, default: "currentcolor" },
          strokeWidth: { type: Number, default: 1 },
          step: { type: Array, default: () => [10, 10] }
      },
      setup(props, { attrs }) {
          const context = VueCompositionApi.inject(ContextSymbol);
          const graticulePath = VueCompositionApi.computed(() => {
              if (!context)
                  return null;
              context.update;
              return context.path(d3.geoGraticule().step(props.step)());
          });
          VueCompositionApi.watch(() => {
              // TODO: not any change
              if (!context || context && !context.canvas || context && !context.svg)
                  return;
              const ctx = context.svg.getContext("2d");
              const path = new Path2D(graticulePath.value);
              ctx.beginPath();
              ctx.lineWidth = props.strokeWidth || 1;
              ctx.strokeStyle = props.stroke || "black";
              ctx.fillStyle = props.fill || "yellow";
              ctx.fill(path);
              ctx.stroke(path);
          });
          return {
              canvas: context && context.canvas,
              graticulePath
          };
      }
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return !_vm.canvas
      ? _c("path", {
          staticClass: "rsm-graticule",
          attrs: { d: _vm.graticulePath, fill: _vm.fill, stroke: _vm.stroke }
        })
      : _vm._e()
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = undefined;
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapGraticule = normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$5 = {
      props: {
          from: { type: Array, default: () => [0, 0] },
          to: { type: Array, default: () => [0, 0] },
          coordinates: Array,
          stroke: { type: String, default: "currentcolor" },
          strokeWidth: { type: Number, default: 3 },
          fill: { type: String, default: "transparent" }
      },
      setup(props) {
          const context = VueCompositionApi.inject(ContextSymbol);
          const lineData = VueCompositionApi.computed(() => {
              if (!context)
                  return null;
              context.update;
              return context.path({
                  type: "LineString",
                  coordinates: props.coordinates || [props.from, props.to]
              });
          });
          VueCompositionApi.watch(() => {
              // TODO: not any change
              if (!context || context && !context.canvas || context && !context.svg)
                  return;
              const ctx = context.svg.getContext("2d");
              ctx.beginPath();
              ctx.strokeStyle = props.stroke;
              ctx.lineWidth = props.strokeWidth;
              ctx.fillStyle = props.stroke;
              const path = new Path2D(lineData.value);
              ctx.stroke(path);
          });
          return {
              canvas: context && context.canvas,
              lineData
          };
      }
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return !_vm.canvas
      ? _c("path", {
          staticClass: "rsm-line",
          attrs: {
            d: _vm.lineData,
            stroke: _vm.stroke,
            "stroke-width": _vm.strokeWidth,
            fill: _vm.fill
          }
        })
      : _vm._e()
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = undefined;
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapLine = normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$6 = {
      props: {
          coordinates: { type: Array, required: true }
      },
      setup(props) {
          const context = VueCompositionApi.inject(ContextSymbol);
          return {
              canvas: context && context.canvas,
              transform: VueCompositionApi.computed(() => {
                  if (!context)
                      return null;
                  context.update;
                  const [x, y] = context.projection(props.coordinates);
                  return `translate(${x}, ${y})`;
              })
          };
      }
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return !_vm.canvas
      ? _c(
          "g",
          { staticClass: "rsm-marker", attrs: { transform: _vm.transform } },
          [_vm._t("default")],
          2
        )
      : _vm._e()
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = undefined;
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapMarker = normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$7 = {
      inheritAttrs: false,
      props: {
          id: { type: String, default: "rsm-sphere" },
          fill: { type: String, default: "transparent" },
          stroke: { type: String, default: "currentcolor" },
          strokeWidth: { type: Number, default: 0.5 }
      },
      setup(props) {
          const context = VueCompositionApi.inject(ContextSymbol);
          const spherePath = VueCompositionApi.computed(() => {
              if (!context)
                  return null;
              context.update;
              return context.path({ type: "Sphere" });
          });
          VueCompositionApi.watch(() => {
              // TODO: not any change
              if (!context || (context && !context.canvas) || (context && !context.svg))
                  return;
              const ctx = context.svg.getContext("2d");
              const path = new Path2D(spherePath.value);
              ctx.beginPath();
              ctx.lineWidth = props.strokeWidth || 1;
              ctx.strokeStyle = props.stroke || "black";
              ctx.fillStyle = props.fill || "yellow";
              ctx.fill(path);
              ctx.stroke(path);
          });
          return {
              canvas: context && context.canvas,
              spherePath
          };
      }
  };

  /* script */
  const __vue_script__$7 = script$7;
  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return !_vm.canvas
      ? _c("g", [
          _c("defs", [
            _c("clipPath", { attrs: { id: _vm.id } }, [
              _c("path", { attrs: { d: _vm.spherePath } })
            ])
          ]),
          _vm._v(" "),
          _c(
            "path",
            _vm._b(
              {
                staticClass: "rsm-sphere",
                attrs: {
                  d: _vm.spherePath,
                  fill: _vm.fill,
                  stroke: _vm.stroke,
                  "stroke-width": _vm.strokeWidth
                }
              },
              "path",
              _vm.$attrs,
              false
            )
          )
        ])
      : _vm._e()
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = undefined;
    /* scoped */
    const __vue_scope_id__$7 = "data-v-e5839798";
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapSphere = normalizeComponent(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      false,
      undefined,
      undefined,
      undefined
    );

  var script$8 = {
      inheritAttrs: false,
      props: {
          subject: Array,
          dx: { type: Number, default: 30 },
          dy: { type: Number, default: 30 },
          curve: { type: Number, default: 0 }
      },
      setup(props) {
          const context = VueCompositionApi.inject(ContextSymbol);
          const point = VueCompositionApi.computed(() => {
              if (!context)
                  return null;
              context.update;
              if (!context.projection)
                  return { x: 0, y: 0 };
              const [x, y] = context.projection(props.subject);
              return { x, y };
          });
          return {
              canvas: context && context.canvas,
              translate: VueCompositionApi.computed(() => `translate(${point.value.x + props.dx}, ${point.value.y + props.dy})`),
              connectorPath: VueCompositionApi.computed(() => createConnectorPath(props.dx, props.dy, props.curve))
          };
      }
  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return !_vm.canvas
      ? _c(
          "g",
          { staticClass: "rsm-annotation", attrs: { transform: _vm.translate } },
          [
            _c(
              "path",
              _vm._b(
                { attrs: { d: _vm.connectorPath, fill: "transparent" } },
                "path",
                _vm.$attrs,
                false
              )
            ),
            _vm._v(" "),
            _vm._t("default")
          ],
          2
        )
      : _vm._e()
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = undefined;
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var MapAnnotation = normalizeComponent(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      false,
      undefined,
      undefined,
      undefined
    );



  var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MapProvider: mapProvider,
    MapComposable: MapComposable,
    MapGeographies: MapGeographies,
    MapGeography: MapGeography,
    MapGraticule: MapGraticule,
    MapLine: MapLine,
    MapMarker: MapMarker,
    MapSphere: MapSphere,
    MapAnnotation: MapAnnotation
  });

  const plugin = {
      install(Vue) {
          Vue.use(VueCompositionApi__default);
          Object.keys(components).forEach((name) => {
              let comp = components[name];
              Vue.component(name, comp);
          });
      }
  };

  exports.MapAnnotation = MapAnnotation;
  exports.MapComposable = MapComposable;
  exports.MapGeographies = MapGeographies;
  exports.MapGeography = MapGeography;
  exports.MapGraticule = MapGraticule;
  exports.MapLine = MapLine;
  exports.MapMarker = MapMarker;
  exports.MapProvider = mapProvider;
  exports.MapSphere = MapSphere;
  exports.default = plugin;

  return exports;

}({}, vueCompositionApi, d3));
