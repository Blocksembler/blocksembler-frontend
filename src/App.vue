<script lang="ts" setup>
import {Modal} from "bootstrap";
import {onMounted, ref} from "vue";

import BlocksemblerNavigation from "@/components/BlocksemblerNavigation.vue";
import BlocksemblerCodingView from "@/components/BlocksemblerCodingView.vue";
import {initLogSync} from "@/logging";
import TanModal from "@/components/modals/TanModal.vue";
import {BACKEND_API_URL, BACKEND_DISABLED} from "@/config";
import {codingWorkspaceState} from "@/state";

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const isValidTan = async (tanCode: string): Promise<boolean> => {
  const tanEndpoint = `${BACKEND_API_URL}/tans/${tanCode}`;

  return fetch(tanEndpoint).then(response => {
    if (response.status !== 200) {
      throw Error(response.statusText);
    }

    return response.json()
  }).then(tanCode => {
    let validFrom: Date | null = null;
    let validTo: Date | null = null;

    const now = new Date();

    if ("valid_from" in tanCode && tanCode["valid_from"]) {
      validFrom = new Date(tanCode["valid_from"]);
      console.log("validFrom", validFrom);
      if (validFrom > now) return false;
    }

    if ("valid_to" in tanCode && tanCode["valid_to"]) {
      validTo = new Date(tanCode["valid_to"]);
      console.log("validTo", validTo);
      if (validTo < now) return false;
    }

    console.log("tan is valid");
    return true
  }).catch(error => {
    console.log(error);
    return false;
  })
}

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
