<script setup>
import {reactive} from "vue";
import BaseButton from "./BaseButton.vue";
import {codeParser, emulator, generatedCode, settings} from "../state";
import BaseModal from "./BaseModal.vue";
import PlayCircleIcon from "@/components/icons/PlayCircleIcon.vue";
import PlayIcon from "@/components/icons/PlayIcon.vue";
import PauseIcon from "@/components/icons/PauseIcon.vue";
import ArrowRightSquareIcon from "@/components/icons/ArrowRightSquareIcon.vue";
import ReplyIcon from "@/components/icons/ReplyIcon.vue";
import TerminalIcon from "@/components/icons/TerminalIcon.vue";

const output = reactive(emulator.output);

const assembleHandler = () => {
  console.log("start parsing...");
  let parsedProgram = codeParser.parseCode(generatedCode.value);
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
      <BaseButton @click="assembleHandler">
        <PlayCircleIcon/>
        Assemble & Load to Memory
      </BaseButton>
      <BaseButton v-if="emulator.isPaused" @click="runProgram">
        <PlayIcon/>
        Run
      </BaseButton>
      <BaseButton v-else @click="pauseProgram">
        <PauseIcon/>
        Pause
      </BaseButton>
      <BaseButton @click="executeNext">
        <ArrowRightSquareIcon/>
        Execute & Fetch Next
      </BaseButton>
      <BaseButton @click="reset">
        <ReplyIcon/>
        Reset
      </BaseButton>
      <BaseButton
          :notification-count="output.length"
          data-bs-target="#outputConsole"
          data-bs-toggle="modal"
      >
        <TerminalIcon/>
        Output Console
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
