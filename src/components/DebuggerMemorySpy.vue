<script lang="ts" setup>
import {computed, ref} from "vue";
import {codingWorkspaceState} from "@/state.js";

const startAddress = ref<number>(0);
const sliceSize = ref<number>(0);

const MAX: number = 30;

const memory = computed(() => {
  const emulator = codingWorkspaceState.archPlugin.emulator;

  let start = Math.trunc(Number(startAddress.value)) ? Math.trunc(Number(startAddress.value)) : 0;
  const size = Math.trunc(Number(sliceSize.value)) ? Number(sliceSize.value) : 10;

  if (sliceSize.value > MAX) {
    sliceSize.value = MAX;
  }

  let end = start + size;

  if (start > 2 ** emulator.addressSize) {
    start = 0;
    end = 10;
  } else if (end > 2 ** emulator.addressSize) {
    end = 2 ** emulator.addressSize - 1;
  }

  console.log(start, end);

  return emulator.getMemoryFragment(start, end);
})

</script>
<template>
  <div class="card">
    <div class="card-header"><h4>Memory Inspector</h4></div>
    <div class="card-body overflow-auto">
      <form>
        <div class="mb-3">
          <label class="form-label" for="startAddress">Start Address</label>
          <input id="startAddress" v-model="startAddress" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label" for="size">Size (in Bytes)</label>
          <input id="size" v-model="sliceSize" class="form-control">
        </div>
      </form>
      <table class="table">
        <thead>
        <tr>
          <th scope="col" style="width: 20%">Address</th>
          <th scope="col" style="width: 40%">Binary</th>
          <th scope="col" style="width: 20%">Decimal</th>
          <th scope="col" style="width: 20%">Hex</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="mem in memory" :key="mem.address">
          <td>0x{{ mem.address.toString(16).padStart(4, "0") }}</td>
          <td>
            <pre>{{ mem.value.toBitString() }}</pre>
          </td>
          <td>
            <pre>{{ mem.value.toUnsignedIntValue() }}</pre>
          </td>
          <td>
            <pre>{{ mem.value.toHexValue() }}</pre>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
