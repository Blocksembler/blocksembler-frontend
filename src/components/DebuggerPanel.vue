<script setup>
import DebuggerControlPanel from "./DebuggerControlPanel.vue";
import DebuggerOpCodeList from "./DebuggerOpCodeList.vue";
import DebuggerRegisterSpy from "./DebuggerRegisterSpy.vue";
import DebuggerMemorySpy from "./DebuggerMemorySpy.vue";
</script>
<template>
  <DebuggerControlPanel/>
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
