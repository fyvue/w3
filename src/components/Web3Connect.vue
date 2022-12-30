<script setup lang="ts">
import { useW3State } from "../fyw3";
import { truncateEthAddr, fyw3Data } from "../utils";
import { computed, onMounted } from "vue";
import { useTranslation } from "@fy-/core";
import type { NetworkChain } from "../types";

const props = withDefaults(
  defineProps<{
    forceChainByName?: string;
    forcedChain?: NetworkChain;
    onConnect?: Function;
  }>(),
  {}
);
const w3Store = useW3State();
const wallet = computed(() => w3Store.wallet);
let forcedChain: NetworkChain | undefined = undefined;
if (props.forceChainByName && fyw3Data.chains[props.forceChainByName]) {
  forcedChain = fyw3Data.chains[props.forceChainByName];
} else if (props.forcedChain) {
  forcedChain = props.forcedChain;
}
const connectW3 = async () => {
  await w3Store.connectWallet(forcedChain, props.onConnect);
};
onMounted(async () => {
  await w3Store.checkConnect(forcedChain, props.onConnect);
});
</script>
<template>
  <div>
    <template v-if="!wallet">
      <slot name="disconnected">
        <button class="btn primary" @click="connectW3">
          {{ $t("w3_connect") }}
        </button>
      </slot>
    </template>
    <template v-else>
      <slot name="connected" v-bind:data="wallet">
        <div class="btn disabled">Welcome {{ truncateEthAddr(wallet) }}</div>
      </slot>
    </template>
  </div>
</template>
