<script setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import Blockly from "blockly";

import {blocks} from "../architectures/anna/blocks";
import {annaGenerator} from "../architectures/anna/generator";
import {formatAnnaCode} from "../architectures/anna/formatter";
import {load, save} from "../util/serialization";
import {generatedCode, jsonWorkspace} from "../state";

const props = defineProps(["options", "assemblerCode"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

defineExpose({workspace});

onMounted(() => {
  Blockly.common.defineBlocks(blocks);

  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);

  const runCode = () => {
    generatedCode.value = formatAnnaCode(
        annaGenerator.workspaceToCode(workspace.value),
        10
    );
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

  watch(jsonWorkspace, (newValue) => {
    if (newValue) {
      Blockly.Events.disable();
      Blockly.serialization.workspaces.load(newValue, workspace.value, false);
      Blockly.Events.enable();
    }
  })

});
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
