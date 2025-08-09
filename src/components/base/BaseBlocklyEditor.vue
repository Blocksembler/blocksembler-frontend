<script lang="ts" setup>
import {onMounted, onUnmounted, ref, shallowRef, watch} from "vue";
import * as Blockly from "blockly";
import {BlockSvg, WorkspaceSvg} from "blockly";
import {codingWorkspaceState} from "@/state";
import {logEvent} from "@/logging";
import {load, save} from "@/util/serialization";
import {Multiselect} from "@mit-app-inventor/blockly-plugin-workspace-multiselect";

import {shadowBlockConversionChangeListener} from "@blockly/shadow-block-converter";

const props = defineProps(["options"]);

const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

onUnmounted(() => {
  workspace.value.render();
});

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
      let code = generator.workspaceToCode(workspace.value);
      codingWorkspaceState.sourceCode = codingWorkspaceState.archPlugin.formatter.formatCode(code);
    } catch (error) {
      if (error instanceof Error) {
        logEvent('failedToGenerateAssemblyCode', error.toString());
      }
    }
  };

  let jsonWorkspace = load();

  if (jsonWorkspace) {
    Blockly.Events.disable();
    try {
      let archName = jsonWorkspace.archName;
      let blocklyWorkspace = jsonWorkspace.blocklyWorkspace;

      if (!archName || !blocklyWorkspace) {
        logEvent("failedToLoadBlocklyWorkspaceFromLS",
            "Local storage did not provide a archName and blocklyWorkspace value.");
      } else if (archName !== codingWorkspaceState.archPlugin.name) {
        logEvent("failedToLoadBlocklyWorkspaceFromLS",
            "Could not load from local storage due to architecture plugin mismatch.");
      } else {
        Blockly.serialization.workspaces.load(blocklyWorkspace, workspace.value, {recordUndo: false});
      }
    } catch (error) {
      if (error instanceof Error) {
        logEvent('failedToLoadBlocklyWorkspaceFromLS', error.toString());
      }
    } finally {
      Blockly.Events.enable();
    }
  }

  runCode();

  workspace.value.addChangeListener((e: Blockly.Events.Abstract) => {
    if (e.isUiEvent) {
      return;
    }

    const data = {
      archName: codingWorkspaceState.archPlugin.name,
      blocklyWorkspace: Blockly.serialization.workspaces.save(workspace.value),
    }

    logEvent('blocklyWorkspaceChanged', JSON.stringify(data));
    save(data);
  });

  workspace.value.addChangeListener((e: Blockly.Events.Abstract) => {
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

const onInitWorkspaceHandler = (code: string) => {
  Blockly.Events.disable();
  loadWorkspaceFromAssemblyCode(workspace.value, code);
  Blockly.Events.enable();
}

const loadWorkspaceFromAssemblyCode = (ws: WorkspaceSvg, assemblyCode: string) => {
  ws.clear()
  const startBlock = ws.newBlock('start');
  startBlock.initSvg();

  const parser = codingWorkspaceState.archPlugin.parser;
  const parsedProgram = parser.parseCode(assemblyCode, false);

  let prevBlock: BlockSvg = startBlock;
  for (const instruction of parsedProgram) {
    const instructionBlocks = instruction.toBlocks(ws)

    const prevCon = instructionBlocks[0].previousConnection
    if (prevCon) {
      prevBlock.nextConnection.connect(prevCon);
    }

    prevBlock = instructionBlocks[instructionBlocks.length - 1];
  }

  const data = {
    archName: codingWorkspaceState.archPlugin.name,
    blocklyWorkspace: Blockly.serialization.workspaces.save(workspace.value),
  }

  save(data);
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
