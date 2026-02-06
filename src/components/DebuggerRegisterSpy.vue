<script lang="ts" setup>
import {reactive} from "vue";
import {codingWorkspaceState} from "@/state";

const registers = reactive(codingWorkspaceState.archPlugin.emulator.registers);
</script>
<template>

  <div class="card-body p-2 overflow-auto">
    <div class="d-flex flex-wrap gap-2">

      <div
          v-for="(value, name) in registers"
          :key="name"
          class="d-flex align-items-center border rounded-pill px-2 py-1 bg-light"
      >
        <span class="fw-semibold me-2 font-monospace">
          {{ name }}
        </span>

        <span class="badge bg-secondary font-monospace me-1">
          {{ value.toBitString() }}
        </span>

        <span class="badge bg-info text-dark font-monospace">
          {{ value.toUnsignedIntValue() }}
        </span>
      </div>

    </div>
  </div>

</template>
