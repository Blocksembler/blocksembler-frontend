<script setup>
let props = defineProps(["items"]);
</script>

<template>
  <div class="btn-group">
    <button class="btn btn-secondary" type="button" @click="$emit('click', '__default__', $event)">
      <slot></slot>
    </button>
    <button aria-expanded="false" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"
            type="button">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li v-for="item in items">
        <a class="dropdown-item" href="#" @click="$emit('click', item.key, $event)"> {{ item.label }}</a>
      </li>
    </ul>
  </div>

</template>
