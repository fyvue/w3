# @fy-/w3
Web3 utilities for Vue3.
```
  pnpm add @fy-/w3
```

## Usage
(in this example, ClientOnly is provided by @fy-/core)
```vue
<script setup>
import { Web3Connect } from '@fy-/w3';
</script>
<template>
  <div>
    <ClientOnly>
      <Web3Connect force-chain-by-name="polygon" />
    </ClientOnly>
  </div>
</template>
```
