<script lang="ts" setup>
import BaseModal from "@/components/modals/BaseModal.vue";
import {deleteLogData} from "@/logging";
import {Ref, ref} from "vue";

let tanCode: Ref<string> = ref<string>('');

const consentHandler = (): void => {
  window.localStorage?.setItem('blocksembler-tan-code', tanCode.value);
}

const declineHandler = (): void => {
  deleteLogData()
  window.localStorage?.setItem('blocksembler-tan-code', '');
}
</script>

<template>
  <BaseModal savable>
    <template v-slot:default>

      <p id="tan-consent-desc" class="tan-muted">
        By entering your TAN and continuing, you consent that the app will send
        log data to the backend. Logs include</p>
      <ul>
        <li><strong>error messages</strong>,</li>
        <li><strong>workspace state snapshots on change</strong>, and</li>
        <li><strong>button clicks</strong>.</li>
      </ul>
      <p>
        All logged data is strictly associated with your TAN only and no personal data is stored.
      </p>

      <input
          id="tan-input"
          v-model="tanCode"
          aria-required="true"
          class="form-control input w-100"
          inputmode="text"
          name="tan"
          placeholder="e.g. ABCD-1234"
          required
          type="text"
      />

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