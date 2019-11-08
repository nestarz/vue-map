import Vue, { VueConstructor } from "vue";
declare const plugin: {
    install(Vue: VueConstructor<Vue>): void;
};
export * from "./components/index";
export default plugin;
