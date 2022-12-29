import Web3Connect from "./components/Web3Connect.vue";
import { useW3State } from "./fyw3";

declare module "vue" {
  export interface GlobalComponents {
    Web3Connect: typeof import("./components/Web3Connect.vue")["default"];
  }
}

export { Web3Connect, useW3State };
