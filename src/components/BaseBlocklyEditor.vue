<script setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import * as Blockly from "blockly";
import {codingWorkspaceState} from "@/state.js";
import {logEvent} from "@/logging.js";
import {load, save} from "../util/serialization";
import {Multiselect} from "@mit-app-inventor/blockly-plugin-workspace-multiselect";

import {shadowBlockConversionChangeListener} from "@blockly/shadow-block-converter";

const props = defineProps(["options"]);

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
    try {
      let generator = codingWorkspaceState.archPlugin.blocklyGenerator;
      codingWorkspaceState.sourceCode = codingWorkspaceState.archPlugin.formatter.formatCode(
          generator.workspaceToCode(workspace.value)
      );

    } catch (error) {

      console.log(error);
      logEvent('failedToGenerateAssemblyCode', error.toString());
    }
  };

  let jsonWorkspace = load();

  if (jsonWorkspace) {
    Blockly.Events.disable();
    try {
      let archName = jsonWorkspace.archName;
      let blocklyWorkspace = jsonWorkspace.blocklyWorkspace;

      codingWorkspaceState.loadPlugin(archName);
      Blockly.serialization.workspaces.load(blocklyWorkspace, workspace.value, false);
    } catch (error) {
      logEvent('failedToLoadBlocklyWorkspaceFromLS', error.toString());
    } finally {
      Blockly.Events.enable();
    }
  }

  runCode();

  workspace.value.addChangeListener((e) => {
    if (e.isUiEvent) {
      return;
    }

    const data = {
      archName: codingWorkspaceState.archPlugin.name,
      blocklyWorkspace: Blockly.serialization.workspaces.save(workspace.value),
    }

    save(data);
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

  workspace.value.addChangeListener(function (e) {
    delete e['blocks'];
    delete e['xml'];
    logEvent('blocklyWorkspaceChanged', JSON.stringify(e));
  });

});

const onInitWorkspaceHandler = (code) => {
  Blockly.Events.disable();
  loadWorkspaceFromAssemblyCode(workspace.value, code);
  Blockly.Events.enable();
}

const loadWorkspaceFromAssemblyCode = (ws, assemblyCode) => {
  ws.clear()
  const startBlock = ws.newBlock('start');
  startBlock.initSvg();

  const parser = codingWorkspaceState.archPlugin.parser;
  const parsedProgram = parser.parseCode(assemblyCode, false);

  let prevBlock = startBlock;
  for (const instruction of parsedProgram) {
    const instructionBlocks = instruction.toBlocks(ws)
    prevBlock.nextConnection.connect(instructionBlocks[0].previousConnection);
    prevBlock = instructionBlocks[instructionBlocks.length - 1];
  }
}

codingWorkspaceState.addOnInitWorkspaceListener(onInitWorkspaceHandler)

watch(() => codingWorkspaceState.archPlugin, () => {
  workspace.value.updateToolbox(codingWorkspaceState.archPlugin.blocklyToolbox);
})

</script>

<template>
  <div class="p-0 m-0">
    <div ref="blocklyDiv" class="blocklyDiv p-0 m-0"></div>
  </div>
</template>

<style scoped>
.blocklyDiv {
  height: calc(100vh - 66px);
  width: 100%;
}
</style>
