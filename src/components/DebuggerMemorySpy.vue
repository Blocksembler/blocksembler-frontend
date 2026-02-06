<script lang="ts" setup>
import {computed, ref} from "vue";
import {codingWorkspaceState} from "@/state.js";

const startAddress = ref<number>(0);
const sliceSize = ref<number>(10);

const MAX: number = 30;

let collapsed = ref(false);

let hideButtonClickHandler = () => {
  collapsed.value = !collapsed.value;
}

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
    end = 2 ** emulator.addressSize;
  }

  console.log(start, end);

  return emulator.getMemoryFragment(start, end);
})

</script>
<template>

  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <span>Memory View</span>
        <button @click=hideButtonClickHandler>
          <span v-if="collapsed">Show</span>
          <span v-else>Hide</span>
        </button>
      </div>
    </div>
    <div v-if="!collapsed" class="card-body">
      <form>
        <div class="row">
          <div class="col-3 mb-3">
            <label class="form-label fw-bold" for="startAddress">Start Address</label>
            <input id="startAddress" v-model="startAddress" class="form-control">
          </div>
          <div class="col-9 mb-3">
            <label class="form-label fw-bold" for="size">Size (in Bytes)</label>
            <input id="size" v-model="sliceSize" class="form-control">
          </div>
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
