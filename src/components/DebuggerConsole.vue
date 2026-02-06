<script lang="ts" setup>

import {reactive, ref} from "vue";
import {codingWorkspaceState} from "@/state";

const output = reactive(codingWorkspaceState.archPlugin.emulator.output);

let collapsed = ref(false);

let hideButtonClickHandler = () => {
  collapsed.value = !collapsed.value;
}

</script>

<template>

  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between">
      <span>
        Emulator Output
        <span class="badge text-bg-secondary">{{ output.length }}</span>
      </span>
        <button @click=hideButtonClickHandler>
          <span v-if="collapsed">Show</span>
          <span v-else>Hide</span>
        </button>
      </div>
    </div>
    <div v-if="!collapsed" id="terminalBody" ref="terminalBody" class="terminal-body">
      <div v-for="(line, index) in output" :key="index">
        {{ line }}
      </div>
    </div>
  </div>

</template>

<style scoped>

.terminal-body {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  font-size: 0.9rem;
  white-space: pre-wrap;

  background-color: #000;
  color: #00ff9c;

  border: 1px solid #444;

  font-family: monospace;
}

</style>