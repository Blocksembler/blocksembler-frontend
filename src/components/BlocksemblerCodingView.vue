<script setup>
import {ref} from "vue";
import {toolbox} from "../architectures/anna/toolbox";

import BaseBlocklyEditor from "./BaseBlocklyEditor.vue";
import BaseCodeMirrorEditor from "./BaseCodeMirrorEditor.vue";

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
  scrollbars: false,
  sounds: true,
  oneBasedIndex: true,
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-8 p-0">
        <BaseBlocklyEditor :options="options"/>
      </div>
      <div class="col-4 p-0">
        <BaseCodeMirrorEditor :highlightedLine="0"/>
      </div>
    </div>
  </div>
</template>
