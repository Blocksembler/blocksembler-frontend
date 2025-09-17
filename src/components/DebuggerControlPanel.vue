<script lang="ts" setup>
import {reactive} from "vue";
import {codingWorkspaceState, settings} from "@/state";
import {logEvent} from "@/logging";
import BaseButton from "./base/BaseButton.vue";
import BaseModal from "./modals/BaseModal.vue";
import PlayCircleIcon from "@/components/icons/PlayCircleIcon.vue";
import PlayIcon from "@/components/icons/PlayIcon.vue";
import PauseIcon from "@/components/icons/PauseIcon.vue";
import ArrowRightSquareIcon from "@/components/icons/ArrowRightSquareIcon.vue";
import ReplyIcon from "@/components/icons/ReplyIcon.vue";
import TerminalIcon from "@/components/icons/TerminalIcon.vue";
import BaseDropDown from "@/components/base/BaseDropDown.vue";

const output = reactive(codingWorkspaceState.archPlugin.emulator.output);

const assembleHandler = () => {
  let parsedProgram;
  let emulator = codingWorkspaceState.archPlugin.emulator;
  let parser = codingWorkspaceState.archPlugin.parser;

  try {
    parsedProgram = parser.parseCode(codingWorkspaceState.sourceCode);
  } catch (e) {
    if (e instanceof Error) {
      logEvent('parsingFailed', e.toString());
      alert(e.message)
    } else {
      alert(e);
    }

    return;
  }

  try {
    emulator.loadProgram(parsedProgram);
  } catch (e) {
    if (e instanceof Error) {
      logEvent('loadingProgramFailed', e.toString());
    }

    console.log(e);
    alert('Failed to load program to Emulator!');
  }

};

const runProgram = () => {
  let emulator = codingWorkspaceState.archPlugin.emulator;
  emulator.executionSpeed = settings.executionSpeed
  emulator.startExecution()

  logEvent('startExecution');
}

const pauseProgram = () => {
  let emulator = codingWorkspaceState.archPlugin.emulator;
  emulator.pauseExecution()
  logEvent('pauseExecution');
}

const executeNext = () => {
  let emulator = codingWorkspaceState.archPlugin.emulator;
  emulator.executeSingleInstruction();
  logEvent('executeSingleStep');
};

const resetButtonItems = [
  {
    key: '__default__',
    label: 'Reset All',
    clickEvent: (event: MouseEvent): void => {
      event.preventDefault();

      let emulator = codingWorkspaceState.archPlugin.emulator;

      emulator.halt();
      emulator.resetMemory();
      emulator.resetRegisters();

      emulator.output.splice(0, emulator.output.length);

      emulator.isTerminated = false;
      emulator.isPaused = true;
    }
  },
  {
    key: 'reg-only',
    label: 'Reset Registers only',
    clickEvent: (event: MouseEvent): void => {
      event.preventDefault();

      let emulator = codingWorkspaceState.archPlugin.emulator;

      emulator.halt();
      emulator.resetRegisters();

      emulator.isTerminated = false;
      emulator.isPaused = true;
    }
  },
];

</script>

<template>
  <BaseModal id="outputConsole" title="Output Console">
    <textarea
        id="output"
        class="form-control"
        readonly
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
      <BaseButton v-if="codingWorkspaceState.archPlugin.emulator.isPaused" @click="runProgram">
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
      <BaseButton
          v-if="codingWorkspaceState.archPlugin.emulator.hasConsole"
          :notification-count="output.length"
          data-bs-target="#outputConsole"
          data-bs-toggle="modal"
      >
        <TerminalIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Output Console</span>
      </BaseButton>
      <BaseDropDown :items=resetButtonItems>
        <ReplyIcon/>
        <span class="d-none d-md-none d-lg-inline ms-1">Reset All</span>
      </BaseDropDown>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background-color: white;
  z-index: 2;
}
</style>
