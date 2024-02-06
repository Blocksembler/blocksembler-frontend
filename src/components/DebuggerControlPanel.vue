<script setup>
import { computed, reactive, ref } from "vue";
import BaseButton from "./BaseButton.vue";
import { emulator, generatedCode, annaCodeParser } from "../state";

const output = reactive(emulator.output);

const props = defineProps({
  consoleModalId: String,
});

const consoleModel = computed(() => {
  return `#${props.consoleModalId}`;
});

const assembleHandler = () => {
  console.log("start parsing...");
  let parsedProgram = annaCodeParser.parseCode(generatedCode.value);
  console.log("load program to memory...");
  emulator.loadProgramm(parsedProgram);
  console.log("assemble & load finished");
};

const executeNext = () => {
  emulator.executeNextInstruction();
};

const reset = () => {
  console.log("reset registers");
  emulator.resetRegisters();
  console.log("reset memory");
  emulator.resetMemory();
  console.log("reset output");
  while (emulator.output.length > 0) {
    emulator.output.pop();
  }
};
</script>

<template>
  <div
    class="py-3 m-0 navbar sticky-top background-white"
    style="background-color: white"
  >
    <div>
      <BaseButton @click="assembleHandler" icon-name="play-circle">
        Assemble & Load to Memory
      </BaseButton>
      <BaseButton @click="executeNext" icon-name="arrow-right-square">
        Execute & Fetch Next
      </BaseButton>
      <BaseButton @click="reset" icon-name="reply"> Reset </BaseButton>
      <BaseButton
        icon-name="terminal"
        :notification-count="output.length"
        data-bs-toggle="modal"
        :data-bs-target="consoleModel"
      >
        Output Console
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
