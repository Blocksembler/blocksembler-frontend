<script setup>
import BlocksemblerNavigation from "./components/BlocksemblerNavigation.vue";
import BlocksemblerCodingView from "./components/BlocksemblerCodingView.vue";
import BlocksemblerDebugView from "./components/BlocksemblerDebugView.vue";
import Blocksembler404 from "./components/Blocksembler404.vue";

import {computed, ref} from "vue";
import {codingWorkspaceState} from "@/state.js";

const routes = {
  "/": BlocksemblerCodingView,
  "/editor": BlocksemblerCodingView,
  "/debugger": BlocksemblerDebugView,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || Blocksembler404;
});

const exportProject = () => {
  console.log('Export project!');
}

const importProject = (source) => {
  codingWorkspaceState.initWorkspace(source);
}

</script>

<template>
  <BlocksemblerNavigation @exportProject="exportProject" @importProject="importProject"/>
  <component :is="currentView"/>
</template>

<style></style>
