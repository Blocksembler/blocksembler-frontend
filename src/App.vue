<script lang="ts" setup>
import {Modal} from "bootstrap";
import {computed, onMounted, ref} from "vue";

import BlocksemblerNavigation from "@/components/BlocksemblerNavigation.vue";
import BlocksemblerCodingView from "@/components/BlocksemblerCodingView.vue";
import BlocksemblerDebugView from "@/components/BlocksemblerDebugView.vue";
import Blocksembler404 from "@/components/Blocksembler404.vue";
import {initLogSync} from "@/logging";
import TanModal from "@/components/modals/TanModal.vue";


const routes: Record<string, any> = {
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

onMounted(() => {
  const data = window.localStorage?.getItem("blocksembler-tan-code");

  if (data && data !== '') {
    return;
  }

  const el = document.getElementById("tanModal");
  const modal = new Modal(el as Element);
  modal.show();
})

initLogSync();

</script>

<template>
  <TanModal id="tanModal"></TanModal>
  <BlocksemblerNavigation/>
  <component :is="currentView"/>
</template>

<style></style>
