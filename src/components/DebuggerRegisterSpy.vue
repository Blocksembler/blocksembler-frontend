<script lang="ts" setup>
import {reactive} from "vue";
import {codingWorkspaceState} from "@/state";

const registers = reactive(codingWorkspaceState.archPlugin.emulator.registers);
</script>
<template>
  <div class="card">
    <div class="card-header"><h4>Registers</h4></div>
    <div class="card-body overflow-auto">
      <table class="table">
        <thead>
        <tr>
          <th scope="col" style="width: 15%">Name</th>
          <th scope="col" style="width: 85%">Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(value, name) in registers">
          <td>{{ name }}</td>
          <td>
            <pre>{{ value.toBitString() }} ({{ value.toUnsignedIntValue() }})</pre>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
