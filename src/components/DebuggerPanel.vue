<script lang="ts" setup>
import DebuggerOpCodeList from "./DebuggerOpCodeList.vue";
import DebuggerRegisterSpy from "@/components/DebuggerRegisterSpy.vue";
import DebuggerConsole from "@/components/DebuggerConsole.vue";
import DebuggerMemorySpy from "@/components/DebuggerMemorySpy.vue";
</script>
<template>

  <div class="row">
    <div class="col-4">
      <div class="card mb-2">
        <div class="card-header">
          Registers
        </div>
        <div class="card-body m-0 p-0 overflow-scroll" style="height: 50vh;">
          <DebuggerRegisterSpy/>
        </div>
      </div>
    </div>
    <div class="col-8">
      <div class="card mb-2">
        <div class="card-header">
          Loaded Program
        </div>
        <div class="card-body m-0 overflow-scroll" style="height: 50vh;">
          <DebuggerOpCodeList/>
        </div>
      </div>
    </div>
  </div>

  <DebuggerConsole class="mb-2"/>
  <DebuggerMemorySpy/>

</template>

