<script lang="ts" setup>
import {ref} from 'vue'

import BaseBlocklyEditor from "./base/BaseBlocklyEditor.vue";
import {codingWorkspaceState} from "@/state";
import SubmissionModal from "@/components/modals/SubmissionModal.vue";
import DebuggerPanel from "@/components/DebuggerPanel.vue";
import BaseCodeMirrorEditor from "@/components/base/BaseCodeMirrorEditor.vue";

let blocksEnabled = ref(true);

let options = ref({
  toolbox: codingWorkspaceState.archPlugin.blocklyToolbox,
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
  maxInstances: {
    'start': 1,
  },
  multiselectIcon: {
    hideIcon: false,
    weight: 3,
    enabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/select.svg',
    disabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/unselect.svg',
  },
  multiSelectKeys: ['Shift'],

  multiselectCopyPaste: {
    // Enable the copy/paste across tabs feature (true by default).
    crossTab: true,
    // Show the copy/paste menu entries (true by default).
    menu: true,
  },

});

</script>

<template>

  <SubmissionModal id="submission-modal"/>

  <div class="container-fluid">
    <div class="row">
      <div class="col-6 p-0">
        <BaseBlocklyEditor v-if="codingWorkspaceState.blocksEnabled" ref="blocklyEditor" :options="options"/>
        <BaseCodeMirrorEditor v-if="!codingWorkspaceState.blocksEnabled" :highlightedLine="0"/>
      </div>
      <div class="col-6 p-2 debugger">
        <DebuggerPanel/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debugger {
  height: calc(100vh - 100px);
  overflow: scroll;
}
</style>