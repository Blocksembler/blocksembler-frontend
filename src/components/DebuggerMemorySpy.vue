<script setup>
import {computed, ref} from "vue";
import {emulator} from "../state";
import {paddString} from "../util/string";

const startAddress = ref(0);
const size = ref(9);

const memory = computed(() => {
  return emulator.getMemoryFragment(
      startAddress.value,
      startAddress.value + size.value
  );
});

</script>
<template>
  <div class="card">
    <div class="card-header"><h4>Memory Inspector</h4></div>
    <div class="card-body overflow-auto">
      <form>
        <div class="mb-3">
          <label for="startAddress" class="form-label">Start Address</label>
          <input v-model="startAddress" type="number" class="form-control" id="startAddress">
        </div>
        <div class="mb-3">
          <label for="size" class="form-label">Size (in Bytes)</label>
          <input v-model="size" type="number" class="form-control" id="size">
        </div>
      </form>
      <table class="table">
        <thead>
        <tr>
          <th scope="col" style="width: 50%">Address</th>
          <th scope="col" style="width: 50%">Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="mem in memory" :key="mem.address">
          <td>0x{{ paddString(mem.address.toString(16), 4) }}</td>
          <td>
            <pre>{{ mem.word.toBitString() }} ({{ mem.word }})</pre>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
