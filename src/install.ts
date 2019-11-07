import Vue, { VueConstructor, ComponentOptions } from "vue";
import VueCompositionApi from "@vue/composition-api";
import * as components from "./components/index";

const plugin = {
  install(Vue: VueConstructor) {
    Vue.use(VueCompositionApi);

    Object.keys(components).forEach((name: string) => {
      let comp: ComponentOptions<Vue> = (<any>components)[name];
      Vue.component(name, comp);
    });
  },
  ...components
};
export default plugin;
