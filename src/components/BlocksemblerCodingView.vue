<script lang="ts" setup>
import {ref} from 'vue'

import BaseBlocklyEditor from "./base/BaseBlocklyEditor.vue";
import {codingWorkspaceState} from "@/state";
import SubmissionModal from "@/components/modals/SubmissionModal.vue";
import DebuggerPanel from "@/components/DebuggerPanel.vue";
import BaseCodeMirrorEditor from "@/components/base/BaseCodeMirrorEditor.vue";
import BlocksemblerChallengeCard from "@/components/BlocksemblerChallengeCard.vue";
import {BACKEND_DISABLED} from "@/config";

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
      <div class="col-6 p-3 debugger">
        <ul id="debuggerTabs"
            class="nav nav-tabs nav-tabs-dark gap-2 mb-3 shadow-sm p-2 rounded"
            role="tablist">

          <li class="nav-item" role="presentation">
            <button
                id="debugger-tab"
                class="nav-link active d-flex align-items-center gap-2"
                data-bs-target="#debugger"
                data-bs-toggle="tab"
                role="tab"
                type="button">
              <i class="bi bi-bug"></i>
              Debugger
            </button>
          </li>

          <li v-if="!BACKEND_DISABLED" class="nav-item" role="presentation">
            <button
                id="challenge-tab"
                class="nav-link d-flex align-items-center gap-2"
                data-bs-target="#challenge"
                data-bs-toggle="tab"
                role="tab"
                type="button">
              <i class="bi bi-flag"></i>
              Challenge
            </button>
          </li>
        </ul>

        <div class="tab-content border rounded p-3 bg-white shadow-sm">
          <div
              id="debugger"
              class="tab-pane fade show active"
              role="tabpanel"
          >
            <DebuggerPanel/>
          </div>

          <div
              id="challenge"
              class="tab-pane fade"
              role="tabpanel"
          >
            <BlocksemblerChallengeCard/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debugger {
  height: calc(100vh - 100px);
  overflow: scroll;
}

.nav-tabs-dark .nav-link {
  color: white;
  background-color: #6c757d;
  margin-right: 5px;
}

.nav-tabs-dark .nav-link.active {
  color: #fff;
  background-color: #343a40; /* or #343a40 for pure dark */
}

.nav-tabs-dark .nav-link:hover {
  background-color: #343a40;
  color: #fff;
}

</style>