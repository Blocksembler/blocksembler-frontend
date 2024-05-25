<script setup>
import BlocksamblerNavigation from "./components/BlocksamblerNavigation.vue";
import BlocksamblerCodingView from "./components/BlocksamblerCodingView.vue";
import BlocksamblerDebugView from "./components/BlocksamblerDebugView.vue";
import Blocksambler404 from "./components/Blocksambler404.vue";
import BlocksamblerSettings from "./components/BlocksamblerSettings.vue";

import { ref, computed } from "vue";

const routes = {
  "/": BlocksamblerCodingView,
  "/editor": BlocksamblerCodingView,
  "/debugger": BlocksamblerDebugView,
  "/settings": BlocksamblerSettings,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || Blocksambler404;
});
</script>

<template>
  <BlocksamblerNavigation />
  <component :is="currentView" />
</template>

<style></style>
