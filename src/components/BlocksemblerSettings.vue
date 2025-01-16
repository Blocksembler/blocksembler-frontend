<script setup>
import {settings} from "@/state.js";
import BaseModal from "@/components/BaseModal.vue";
import {ref} from "vue";

const settingsRef = ref(settings)

</script>

<template>
  <BaseModal id="settingsModal" title="Settings" savable>
    <h5>General</h5>
    <div class="mb-4">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="settings-audio-enabled"
               v-model="settings.audioEnabled">
        <label class="form-check-label" for="settings-audio-enabled">Enable Audio Effects</label>
      </div>
    </div>
    <h5>Debugger</h5>
    <div class="mb-2">
      <label for="debugger-execution-speed" class="form-label">Milliseconds per Instruction</label>
      <input type="range"
             class="form-range"
             id="debugger-execution-speed"
             min="1"
             max="2000"
             v-model.number="settings.executionSpeed">
      <a>{{ settingsRef.executionSpeed }}ms per instruction</a>
    </div>
  </BaseModal>
</template>

<style scoped>

</style>