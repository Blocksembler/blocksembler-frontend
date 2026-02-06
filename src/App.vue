<script lang="ts" setup>
import {Modal} from "bootstrap";
import {onMounted, ref} from "vue";

import BlocksemblerNavigation from "@/components/BlocksemblerNavigation.vue";
import BlocksemblerCodingView from "@/components/BlocksemblerCodingView.vue";
import {initLogSync} from "@/logging";
import TanModal from "@/components/modals/TanModal.vue";
import {BACKEND_DISABLED} from "@/config";
import {codingWorkspaceState} from "@/state";
import {isValidTan} from "@/api/tans";

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

onMounted(async () => {
  if (BACKEND_DISABLED) return;

  const tanCode = window.localStorage?.getItem("blocksembler-tan-code");
  console.log(`tanCode: ${tanCode}`);

  if (tanCode && await isValidTan(tanCode)) {
    codingWorkspaceState.blocksEnabled = tanCode.startsWith("bbp");
    return
  }

  window.localStorage.removeItem("blocksembler-tan-code");

  const el = document.getElementById("tan-modal");
  const modal = new Modal(el as Element);
  modal.toggle();
})

initLogSync();

</script>

<template>
  <TanModal id="tan-modal"></TanModal>
  <BlocksemblerNavigation/>
  <BlocksemblerCodingView/>
</template>

<style></style>
