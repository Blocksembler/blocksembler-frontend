<script setup>
import {computed} from "vue";

const props = defineProps(["items"]);

let default_item = computed(() => {
  return props.items.filter(item => item.key === "__default__")[0];
})

const button_items = computed(() => {
  return props.items.filter(elem => elem.key !== "__default__");
})

</script>

<template>
  <div class="btn-group">
    <button class="btn btn-secondary" type="button" @click="default_item.clickEvent">
      <slot></slot>
    </button>
    <button aria-expanded="false" class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
            data-bs-toggle="dropdown"
            type="button">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li v-for="item in button_items">
        <a class="dropdown-item" href="#" @click="item.clickEvent"> {{ item.label }}</a>
      </li>
    </ul>
  </div>

</template>
