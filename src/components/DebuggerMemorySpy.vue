<script setup>
import BaseButton from "./BaseButton.vue";
import { computed, reactive, ref } from "vue";
import { emulator } from "../state";
import { paddString } from "../util/string";

const pageSize = ref(9);
const page = ref(0);

const memory = computed(() => {
  return emulator.getMemoryFragment(
    page.value * pageSize.value,
    page.value * pageSize.value + pageSize.value
  );
});

const inc = () => {
  page.value += 1;
};

const dec = () => {
  if (page.value != 0) page.value -= 1;
};
</script>
<template>
  <div class="card">
    <div class="card-header"><h4>Memory</h4></div>
    <div class="card-body overflow-auto">
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
