<script setup>

let props = defineProps({
  id: String,
  title: String
});

</script>
<template>
  <div :id="props.id" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ props.title }}</h4>
          <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
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
