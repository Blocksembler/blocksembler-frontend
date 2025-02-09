<script setup>
import BaseCodeMirrorEditor from "./BaseCodeMirrorEditor.vue";
import DebuggerPanel from "./DebuggerPanel.vue";
import {codingWorkspaceState} from "@/state.js";
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-8 px-3 container">
        <DebuggerPanel/>
      </div>
      <div class="col-4 p-0 d-none d-sm-block">
        <BaseCodeMirrorEditor :codingWorkspaceState="codingWorkspaceState" :highlightedLine="0"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(100vh - 100px);
  overflow: scroll;
}
</style>
