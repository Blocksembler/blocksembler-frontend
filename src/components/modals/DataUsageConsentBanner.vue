<script lang="ts" setup>
import BaseModal from "@/components/modals/BaseModal.vue";
import {deleteLogData} from "@/logging";

const consentHandler = (): void => {
  window.localStorage?.setItem('blocksembler-data-usage-consent', 'true');
}

const declineHandler = (): void => {
  deleteLogData()
  window.localStorage?.setItem('blocksembler-data-usage-consent', 'false');
}
</script>

<template>
  <BaseModal savable>
    <template v-slot:default>
      <p>
        We use your browser’s <span class="fw-bold">local storage</span> to ensure the proper functionality of this
        application, including preserving your progress if the tab is closed.
      </p>
      <p>
        We also use your browser’s <span class="fw-bold">IndexedDB</span> to log events (e.g., error messages, button
        clicks, etc.). All such data remains on your <span class="fw-bold">local</span> device and is
        <span class="fw-bold">never</span> shared or transmitted externally.
      </p>
      <p>Please let us know whether you consent to storing log data on your <span class="fw-bold">local</span> device.
      </p>
    </template>
    <template v-slot:header>
      <div class="d-flex w-100 justify-content-start align-items-baseline">
        <h3 class="my-2">Data Usage Consent</h3>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="btn btn-primary" data-bs-dismiss="modal" @click="consentHandler">
        I consent
      </button>
      <button class="btn btn-danger" data-bs-dismiss="modal" @click="declineHandler">
        I decline
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>