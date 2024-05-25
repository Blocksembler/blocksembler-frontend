<script setup>
defineProps(["items"]);
</script>

<template>
  <div class="btn-group m-3">
    <button
        aria-expanded="false"
        class="btn btn-secondary dropdown-toggle"
        data-bs-toggle="dropdown"
        type="button"
    >
      ANNA
    </button>
    <ul class="dropdown-menu">
      <li v-for="item in items" class="dropdown-item">{{ item.name }}</li>
    </ul>
  </div>
</template>
