<script lang="ts" setup>
import DebuggerControlPanel from "./DebuggerControlPanel.vue";
import DebuggerOpCodeList from "./DebuggerOpCodeList.vue";
import DebuggerRegisterSpy from "./DebuggerRegisterSpy.vue";
import DebuggerMemorySpy from "./DebuggerMemorySpy.vue";
</script>
<template>
  <DebuggerControlPanel/>
  <DebuggerOpCodeList/>

  <div class="row my-3 container-fluid w-100 m-0 p-0">
    <div class="col-xl-4 px-0 pe-xl-1 pe-0 mb-2">
      <DebuggerRegisterSpy/>
    </div>
    <div class="col-xl-8 px-0 ps-xl-1 ps-0">
      <DebuggerMemorySpy/>
    </div>
  </div>
</template>

