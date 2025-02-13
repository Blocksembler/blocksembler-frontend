<script setup>
import {computed, ref} from "vue";
import {emulator} from "../state";

const startAddress = ref("0");
const size = ref("9");

const memory = computed(() => {
  const sliceStart = Number(startAddress.value)
  const sliceSize = Number(size.value)
  const sliceEnd = sliceStart + sliceSize;

  console.log(sliceStart, sliceSize, sliceEnd);

  if (!sliceStart || !sliceEnd) {
    return emulator.getMemoryFragment(0, 9);
  }

  return emulator.getMemoryFragment(
      sliceStart,
      sliceEnd,
  );

});

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
          <input id="size" v-model="size" class="form-control" type="number">
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
            <pre>{{ mem.word.toBitString() }}</pre>
          </td>
          <td>
            <pre>{{ mem.word.toUnsignedIntValue() }}</pre>
          </td>
          <td>
            <pre>{{ mem.word.toHexValue() }}</pre>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
