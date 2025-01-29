<script setup>
import {onMounted, ref, watch} from "vue";

import {EditorState} from "@codemirror/state";
import {EditorView, lineNumbers} from "@codemirror/view";

import {oneDark} from "@codemirror/theme-one-dark";

const props = defineProps(['codingWorkspaceState'])

let codemirrorTextarea = ref();
let view = ref();


onMounted(() => {
  let state = EditorState.create({
    doc: props.codingWorkspaceState.sourceCode,
    extensions: [
      oneDark,
      lineNumbers(),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      EditorView.theme({
        "&": {
          height: "calc(100vh - 100px)",
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

const loadCode = (code) => {
  if (view.value) {
    view.value.dispatch({
      changes: {
        from: 0,
        to: view.value.state.doc.length,
        insert: code,
      },
    });
  }
}

watch(() => props.codingWorkspaceState.sourceCode, (code) => loadCode(code));

</script>

<template>
  <div id="assemblerEditor" ref="codemirrorTextarea"></div>
</template>

<style scoped>
#assemblerEditor {
  height: 100%;
}
</style>
