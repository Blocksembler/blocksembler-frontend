<script setup>
import {ref} from "vue";
import {emulator} from "../state";

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
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
          ></button>
        </div>
        <div class="modal-body">
          <textarea
              id="output"
              class="form-control"
              readonly=""
              rows="10"
              wrap="soft"
          >{{ output.join("\n") }}</textarea
          >
        </div>
        <div class="modal-footer">
          <button
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
