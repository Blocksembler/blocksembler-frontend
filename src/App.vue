<script setup>
import BlocksemblerNavigation from "./components/BlocksemblerNavigation.vue";
import BlocksemblerCodingView from "./components/BlocksemblerCodingView.vue";
import BlocksemblerDebugView from "./components/BlocksemblerDebugView.vue";
import Blocksembler404 from "./components/Blocksembler404.vue";
import BlocksemblerSettings from "./components/BlocksemblerSettings.vue";

import { ref, computed } from "vue";

const routes = {
  "/": BlocksemblerCodingView,
  "/editor": BlocksemblerCodingView,
  "/debugger": BlocksemblerDebugView,
  "/settings": BlocksemblerSettings,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || Blocksembler404;
});
</script>

<template>
  <BlocksemblerNavigation />
  <component :is="currentView" />
</template>

<style></style>
