<script setup>
import {reactive, ref} from "vue";
import DebuggerConsoleModal from "./DebuggerConsoleModal.vue";
import DebuggerControlPanel from "./DebuggerControlPanel.vue";
import DebuggerOpCodeList from "./DebuggerOpCodeList.vue";
import DebuggerRegisterSpy from "./DebuggerRegisterSpy.vue";
import DebuggerMemorySpy from "./DebuggerMemorySpy.vue";
import {emulator} from "../state";

const consoleModalId = ref("consoleOutput");

const registers = reactive(emulator.registers);
</script>
<template>
  <DebuggerConsoleModal :id="consoleModalId"/>
  <DebuggerControlPanel :consoleModalId="consoleModalId"></DebuggerControlPanel>
  <DebuggerOpCodeList/>

  <div class="row my-3">
    <div class="col-5">
      <DebuggerRegisterSpy/>
    </div>
    <div class="col-7">
      <DebuggerMemorySpy/>
    </div>
  </div>
</template>
