<script setup>
import {onMounted, ref, shallowRef} from "vue";
import * as Blockly from "blockly";

import "../architectures/armlet/blocks";
import {generator} from "../architectures/armlet/generator";
import {formatAssemblyCode} from "../architectures/formatter.js";
import {load, save} from "../util/serialization";
import {jsonWorkspace} from "../state";
import {loadWorkspaceFromAssemblyCode} from "@/architectures/import.js";
import {Multiselect} from "@mit-app-inventor/blockly-plugin-workspace-multiselect";
import {shadowBlockConversionChangeListener} from "@blockly/shadow-block-converter";

const props = defineProps(["options", "codingWorkspaceState"]);

const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

onMounted(() => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);

  workspace.value.addChangeListener(shadowBlockConversionChangeListener);

  const multiselectPlugin = new Multiselect(workspace.value);
  multiselectPlugin.init(options);

  const runCode = () => {
    let code = formatAssemblyCode(
        generator.workspaceToCode(workspace.value)
    );

    props.codingWorkspaceState.updateSourceCode(code)
  };

  jsonWorkspace.value = load();

  if (jsonWorkspace.value) {
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(jsonWorkspace.value, workspace.value, false);
    Blockly.Events.enable();
  }

  runCode();

  workspace.value.addChangeListener((e) => {
    if (e.isUiEvent) {
      return;
    }

    save(Blockly.serialization.workspaces.save(workspace.value));
  });

  workspace.value.addChangeListener((e) => {
    if (
        e.isUiEvent ||
        e.type === Blockly.Events.FINISHED_LOADING ||
        workspace.value.isDragging()
    ) {
      return;
    }
    runCode();
  });

});

const refresh = (code) => {
  Blockly.Events.disable();
  loadWorkspaceFromAssemblyCode(workspace.value, code);
  Blockly.Events.enable();
}

props.codingWorkspaceState.addBlockEditorRefreshCallback(refresh)

</script>

<template>
  <div class="p-0 m-0">
    <div ref="blocklyDiv" class="blocklyDiv p-0 m-0"></div>
  </div>
</template>

<style scoped>
.blocklyDiv {
  height: calc(100vh - 100px);
  width: 100%;
}
</style>
