<script setup>
import BaseCodeMirrorEditor from "./BaseCodeMirrorEditor.vue";
import DebuggerPanel from "./DebuggerPanel.vue";
import {codingWorkspaceState} from "@/state.js";
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-8 px-3">
        <DebuggerPanel/>
      </div>
      <div class="col-4 p-0">
        <BaseCodeMirrorEditor :codingWorkspaceState="codingWorkspaceState" :highlightedLine="0"/>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
