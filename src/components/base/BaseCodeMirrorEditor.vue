<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";

import {EditorView, lineNumbers} from "@codemirror/view"

import {EditorState} from "@codemirror/state";

import {oneDark} from "@codemirror/theme-one-dark";
import {codingWorkspaceState} from "@/state";

let codemirrorTextarea = ref();
let view = ref();


onMounted(() => {
  let state = EditorState.create({
    doc: codingWorkspaceState.sourceCode,
    extensions: [
      oneDark,
      lineNumbers(),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      EditorView.theme({
        "&": {
          height: "calc(100vh - 66px)",
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

const loadCode = (code: string) => {
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

watch(() => codingWorkspaceState.sourceCode, code => loadCode(code));

</script>

<template>
  <div id="assemblerEditor" ref="codemirrorTextarea"></div>
</template>

<style scoped>

</style>
