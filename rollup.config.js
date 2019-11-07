import ts from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import vue from "rollup-plugin-vue";
import pkg from "./package.json";
import css from "rollup-plugin-css-only";
import nodeResolve from "rollup-plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";

export default {
  input: "src/install.ts",
  plugins: [
    autoExternal({
      dependencies: false
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    css({ output: "dist/style.css" }),
    commonjs(),
    ts({
      objectHashIgnoreUnknownHack: true,
      clean: true,
      useTsconfigDeclarationDir: true
    }),
    vue({ css: false })
  ],
  output: [
    {
      file: pkg.module,
      format: "es"
    },
    {
      file: pkg.browser,
      format: "iife",
      name: "VueMap",
      globals: {
        '@vue/composition-api': 'vueCompositionApi',
        'd3': 'd3'
      },
    }
  ]
};
