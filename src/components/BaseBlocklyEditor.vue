<script setup>
import {onMounted, ref, shallowRef} from "vue";
import Blockly from "blockly";

import {blocks} from "../architectures/anna/blocks";
import {annaGenerator} from "../architectures/anna/generator";
import {formatAnnaCode} from "../architectures/anna/formatter";
import {load, save} from "../util/serialization";
import {generatedCode} from "../state";

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

  load(workspace.value);

  console.log(workspace.value.getTopBlocks())
  if (workspace.value.getTopBlocks().length === 0) {
    workspace.value.newBlock('start');
  }

  runCode();

  workspace.value.addChangeListener((e) => {
    if (e.isUiEvent) {
      return;
    }

    save(workspace.value);
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
</script>

<template>
  <div class="p-0 m-0">
    <div ref="blocklyDiv" class="blocklyDiv p-0 m-0"></div>
  </div>
</template>

<style scoped>
.blocklyDiv {
  height: calc(100vh - 80px);
  width: 100%;
}
</style>
