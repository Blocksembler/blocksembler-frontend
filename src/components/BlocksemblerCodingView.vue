<script lang="ts" setup>
import {ref} from 'vue'

import BaseBlocklyEditor from "./base/BaseBlocklyEditor.vue";
import {codingWorkspaceState} from "@/state";
import SubmissionModal from "@/components/modals/SubmissionModal.vue";
import DebuggerPanel from "@/components/DebuggerPanel.vue";
import BaseCodeMirrorEditor from "@/components/base/BaseCodeMirrorEditor.vue";
import BlocksemblerChallengeCard from "@/components/BlocksemblerChallengeCard.vue";
import DebuggerControlPanel from "@/components/DebuggerControlPanel.vue";

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
  <SubmissionModal id="submission-modal" @gradingReceived="() => {console.log('hi')}"/>
  <div class="container-fluid m-0 p-0">
    <BaseBlocklyEditor v-if="codingWorkspaceState.blocksEnabled" ref="blocklyEditor" :options="options"/>
    <BaseCodeMirrorEditor v-if="!codingWorkspaceState.blocksEnabled" :highlightedLine="0"/>
  </div>

  <div id="debuggerFlyout" aria-labelledby="debuggerFlyoutLabel" class="offcanvas offcanvas-end w-75" tabindex="-1">
    <div class="offcanvas-header">
      <DebuggerControlPanel/>
      <button aria-label="Close" class="btn-close text-reset" data-bs-dismiss="offcanvas" type="button"></button>
    </div>

    <div class="offcanvas-body">
      <DebuggerPanel/>
    </div>
  </div>

  <div id="challengeCardFlyout" aria-labelledby="challengeCardFlyoutLabel" class="offcanvas offcanvas-end w-50"
       tabindex="-1">
    <div class="offcanvas-header">
      <h2 id="challengeCardLabel" class="offcanvas-title">Exercise</h2>
      <button aria-label="Close" class="btn-close text-reset" data-bs-dismiss="offcanvas" type="button"></button>
    </div>

    <div class="offcanvas-body">
      <BlocksemblerChallengeCard/>
    </div>
  </div>

</template>

<style scoped>

.offcanvas-header {
  padding-top: 0;
  padding-bottom: 0;
}

</style>