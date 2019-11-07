import Vue, { VueConstructor } from "vue";
declare const plugin: {
    MapProvider: VueConstructor<Vue>;
    MapComposable: VueConstructor<Vue>;
    MapGeographies: VueConstructor<Vue>;
    MapGeography: VueConstructor<Vue>;
    MapGraticule: VueConstructor<Vue>;
    MapLine: VueConstructor<Vue>;
    MapMarker: VueConstructor<Vue>;
    MapSphere: VueConstructor<Vue>;
    MapAnnotation: VueConstructor<Vue>;
    install(Vue: VueConstructor<Vue>): void;
};
export default plugin;
