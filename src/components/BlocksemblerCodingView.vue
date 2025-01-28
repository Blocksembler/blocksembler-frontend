<script setup>
import {ref} from 'vue'
import {toolbox} from "../architectures/armlet/toolbox";

import BaseBlocklyEditor from "./BaseBlocklyEditor.vue";
import BaseCodeMirrorEditor from "./BaseCodeMirrorEditor.vue";
import {codingWorkspaceState} from "@/state.js";

let options = ref({
  toolbox: toolbox,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: "start",
  css: true,
  rtl: false,
  scrollbars: true,
  sounds: true,
  oneBasedIndex: true,
});

</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-8 p-0">
        <BaseBlocklyEditor ref="blocklyEditor" :options="options" :codingWorkspaceState="codingWorkspaceState"/>
      </div>
      <div class="col-4 p-0">
        <BaseCodeMirrorEditor ref="codeMirrorEditor" :codingWorkspaceState="codingWorkspaceState"/>
      </div>
    </div>
  </div>
</template>
