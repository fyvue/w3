/// <reference types="vite/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
export {};
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
