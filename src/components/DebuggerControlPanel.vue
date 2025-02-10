<script setup>
import {reactive} from "vue";
import BaseButton from "./BaseButton.vue";
import {codeParser, codingWorkspaceState, emulator, settings} from "../state";
import BaseModal from "./BaseModal.vue";
import PlayCircleIcon from "@/components/icons/PlayCircleIcon.vue";
import PlayIcon from "@/components/icons/PlayIcon.vue";
import PauseIcon from "@/components/icons/PauseIcon.vue";
import ArrowRightSquareIcon from "@/components/icons/ArrowRightSquareIcon.vue";
import ReplyIcon from "@/components/icons/ReplyIcon.vue";
import TerminalIcon from "@/components/icons/TerminalIcon.vue";
import {logEvent} from "@/logging.js";
import BaseDropDown from "@/components/BaseDropDown.vue";

const output = reactive(emulator.output);

defineProps(['sourceCode'])

const assembleHandler = () => {
  let parsedProgram, resolvedProgram;

  try {
    parsedProgram = codeParser.parseCode(codingWorkspaceState.sourceCode);
  } catch (e) {
    logEvent('parsingFailed', e.toString());
    alert('Failed to parse the assembly program!');
    return;
  }

  try {
    resolvedProgram = codeParser.resolveLabels(parsedProgram);
  } catch (e) {
    logEvent('resolvingLabelsFailed', e.toString());
    alert('Failed to parse the assembly program! \n\n Reason: Not every label-primitive defined in code!');
    return;
  }

  try {
    emulator.loadProgram(resolvedProgram);
  } catch (e) {
    logEvent('loadingProgramFailed', e.toString());
    alert('Failed to load program to Emulator!');
  }

};

const runProgram = () => {
  emulator.executionSpeed = settings.executionSpeed
  emulator.startExecution()

  logEvent('startExecution');
}

const pauseProgram = () => {
  emulator.pauseExecution()
  logEvent('pauseExecution');
}

const executeNext = () => {
  emulator.executeSingleInstruction();
  logEvent('executeSingleStep');
};

const reset = (buttonKey, event) => {
  event.preventDefault();

  emulator.isTerminated = false;
  emulator.isPaused = true;

  if (buttonKey === 'reg-only' || buttonKey === '__default__') {
    emulator.resetRegisters();
  }

  if (buttonKey === 'memory-only' || buttonKey === '__default__') {
    emulator.resetMemory();
  }

  while (emulator.output.length > 0) {
    emulator.output.pop();
  }

  logEvent('resetEmulator');
};

const resetButtonItems = [
  {key: 'memory-only', label: 'Reset Memory only'},
  {key: 'reg-only', label: 'Reset Registers only'},
];
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

  <div class="py-3 m-0 navbar sticky-top background-white">
    <div>
      <BaseButton @click="assembleHandler">
        <PlayCircleIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Load to Memory</span>
      </BaseButton>
      <BaseButton v-if="emulator.isPaused" @click="runProgram">
        <PlayIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Run</span>
      </BaseButton>
      <BaseButton v-else @click="pauseProgram">
        <PauseIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Pause</span>
      </BaseButton>
      <BaseButton @click="executeNext">
        <ArrowRightSquareIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Execute & Fetch Next</span>
      </BaseButton>
      <BaseDropDown :items=resetButtonItems @click="reset">
        <ReplyIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Reset All</span>
      </BaseDropDown>
      <BaseButton
          v-if="emulator.hasConsole"
          :notification-count="output.length"
          data-bs-target="#outputConsole"
          data-bs-toggle="modal"
      >
        <TerminalIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Output Console</span>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background-color: white;
  z-index: 2;
}
</style>
