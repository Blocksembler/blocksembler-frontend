<script lang="ts" setup>
import {onMounted, ref} from "vue";

import {EditorView, keymap, lineNumbers} from "@codemirror/view"
import {defaultKeymap, history, historyKeymap, indentWithTab} from "@codemirror/commands";
import {indentUnit} from "@codemirror/language";

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
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab,]),
      history(),
      indentUnit.of("          "),
      EditorView.editable.of(true),
      EditorView.theme({
        "&": {
          height: "calc(100vh - 66px)",
          width: "100%",
        },
      }),
      EditorView.updateListener.of((update) => {

        if (update.docChanged) {
          console.log(update.state.doc.toString());
          codingWorkspaceState.sourceCode = update.state.doc.toString();
        }
      })
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
</script>

<template>
  <div id="assemblerEditor" ref="codemirrorTextarea"></div>
</template>

<style scoped>

</style>
