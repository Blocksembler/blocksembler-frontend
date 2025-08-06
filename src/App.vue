<script lang="ts" setup>
import {Modal} from "bootstrap";
import {computed, onMounted, ref} from "vue";

import BlocksemblerNavigation from "@/components/BlocksemblerNavigation.vue";
import BlocksemblerCodingView from "@/components/BlocksemblerCodingView.vue";
import BlocksemblerDebugView from "@/components/BlocksemblerDebugView.vue";
import Blocksembler404 from "@/components/Blocksembler404.vue";
import DataUsageConsentBanner from "@/components/modals/DataUsageConsentBanner.vue";


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
  const data = window.localStorage?.getItem("blocksembler-data-usage-consent");


  if (data && data === 'true' || data === 'false') {
    return;
  }

  const el = document.getElementById("cookieConsentBanner");
  const consentModal = new Modal(el as Element);
  consentModal.show();
})

</script>

<template>
  <DataUsageConsentBanner id="cookieConsentBanner" title="Cookie Consent"/>
  <BlocksemblerNavigation/>
  <component :is="currentView"/>
</template>

<style></style>
