<script setup>
let props = defineProps({
  notificationCount: Number,
});
</script>
<template>
  <button class="btn btn-secondary position-relative me-2">
    <slot></slot>
    <span
        v-if="notificationCount > 0"
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
    >
      {{ props.notificationCount }}
    </span>
  </button>
</template>
