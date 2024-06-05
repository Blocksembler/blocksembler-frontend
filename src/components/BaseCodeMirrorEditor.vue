<script setup>
import {onMounted, ref, watch} from "vue";

import {EditorState} from "@codemirror/state";
import {EditorView, lineNumbers} from "@codemirror/view";

import { oneDark } from "@codemirror/theme-one-dark";

import {generatedCode} from "../state";

let codemirrorTextarea = ref();
let view = ref();

let props = defineProps({
  highlightedLine: Number,
});

onMounted(() => {
  let state = EditorState.create({
    doc: generatedCode.value,
    extensions: [
      oneDark,
      lineNumbers(),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      EditorView.theme({
        "&": {
          minHeight: "calc(100vh - 100px)",
          height: "100%",
          width: "100%",
        },
      }),
    ],
  });

  view.value = new EditorView({
    state: state,
    parent: codemirrorTextarea.value,
  });

});

const updateDocument = () => {
  view.value.dispatch({
    changes: {
      from: 0,
      to: view.value.state.doc.length,
      insert: generatedCode.value,
    },
  });
};

watch(generatedCode, updateDocument);
</script>

<template>
  <div id="assemblerEditor" ref="codemirrorTextarea"></div>
</template>

<style scoped>
#assemblerEditor {
  height: 100%;
}
</style>
