import Web3Connect from "./components/Web3Connect.vue";
import { FyWeb3 } from "./fyw3";
import type { App, Plugin } from "vue";
import { inject } from "vue";

declare module "vue" {
  export interface GlobalComponents {
    Web3Connect: typeof import("./components/Web3Connect.vue")["default"];
  }
}

const createFyW3 = () => {
  const fyw3 = new FyWeb3();
  return {
    install(app: App) {
      app.provide("fyw3", fyw3);
      if (app.config.globalProperties) {
        app.config.globalProperties.$fyw3 = fyw3;
      }
    },
  } as Plugin;
};
const useFyW3 = () => {
  const fyw3 = inject<FyWeb3>("fyw3");
  if (!fyw3) throw new Error("Did you apply app.use(fyw3)?");
  return fyw3;
};

export { Web3Connect, useFyW3, createFyW3 };
