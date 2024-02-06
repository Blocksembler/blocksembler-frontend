<script setup>
defineProps(["items"]);
</script>

<template>
  <div class="btn-group m-3">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      ANNA
    </button>
    <ul class="dropdown-menu">
      <li v-for="item in items" class="dropdown-item">{{ item.name }}</li>
    </ul>
  </div>
</template>
