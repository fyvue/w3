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
  await w3Store.connectWallet(forcedChain);
};
onMounted(async () => {
  await w3Store.checkConnect(forcedChain);
});
</script>
<template>
  <div>
    <button class="btn primary" @click="connectW3" v-if="!wallet">
      {{ $t("w3_connect") }}
    </button>
    <div class="btn disabled" v-else>Welcome {{ truncateEthAddr(wallet) }}</div>
  </div>
</template>
