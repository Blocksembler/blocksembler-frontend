<script setup>
import { ref } from "vue";
import { emulator } from "../state";

let props = defineProps({
  id: String,
});

const output = ref(emulator.output);
</script>
<template>
  <div :id="props.id" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Console Output</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <textarea
            class="form-control"
            id="output"
            rows="10"
            wrap="off"
            readonly=""
            >{{ output.join("\n") }}</textarea
          >
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
