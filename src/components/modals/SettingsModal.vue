<script setup>
import BaseModal from "@/components/modals/BaseModal.vue";
import {settings} from "@/state";
</script>

<template>
  <BaseModal id="settingsModal" data-bs-backdrop="static" savable title="Settings">
    <template v-slot:header>
      <div class="d-flex w-100 justify-content-start align-items-baseline">
        <h3 class="my-2">Settings</h3>
      </div>
    </template>
    <template v-slot:default>
      <label class="form-label" for="customRange1">Milliseconds per Instruction</label>
      <input id="customRange1"
             v-model.number="settings.executionSpeed"
             class="form-range"
             max="2000"
             min="1"
             type="range">
      <p>{{ settings.executionSpeed }}ms per instruction</p>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>