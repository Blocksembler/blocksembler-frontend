<script setup>
import {reactive} from "vue";
import BaseButton from "./BaseButton.vue";
import {annaCodeParser, emulator, generatedCode, settings} from "../state";
import BaseModal from "./BaseModal.vue";

const output = reactive(emulator.output);

const assembleHandler = () => {
  console.log("start parsing...");
  let parsedProgram = annaCodeParser.parseCode(generatedCode.value);
  console.log("load program to memory...");
  emulator.loadProgram(parsedProgram);
  console.log("assemble & load finished");
};

const runProgram = () => {
  emulator.executionSpeed = settings.executionSpeed
  emulator.startExecution()
}

const pauseProgram = () => {
  emulator.pauseExecution()
}

const executeNext = () => {
  emulator.executeSingleInstruction();
};

const reset = () => {
  console.log("set emulator to not terminated state")
  emulator.isTerminated = false;
  console.log("set emulator to paused state")
  emulator.isPaused = true;
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
  <BaseModal id="outputConsole" title="Output Console">
    <textarea
        id="output"
        class="form-control"
        readonly=""
        rows="10"
        wrap="soft"
    >{{ output.join("\n") }}</textarea>
  </BaseModal>

  <div
      class="py-3 m-0 navbar sticky-top background-white"
      style="background-color: white"
  >
    <div>
      <BaseButton icon-name="play-circle" @click="assembleHandler">
        Assemble & Load to Memory
      </BaseButton>
      <BaseButton v-if="emulator.isPaused" @click="runProgram" icon-name="play">
        Run
      </BaseButton>
      <BaseButton v-else @click="pauseProgram" icon-name="pause">
        Pause
      </BaseButton>
      <BaseButton icon-name="arrow-right-square" @click="executeNext">
        Execute & Fetch Next
      </BaseButton>
      <BaseButton icon-name="reply" @click="reset"> Reset</BaseButton>
      <BaseButton
          data-bs-target="#outputConsole"
          :notification-count="output.length"
          data-bs-toggle="modal"
          icon-name="terminal"
      >
        Output Console
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
