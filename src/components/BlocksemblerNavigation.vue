<script setup>
import {reactive} from "vue";
import BaseIcon from "./BaseIcon.vue";

let menuItems = reactive([
  {label: "Editor", href: "/#/editor", icon: "pencil"},
  {label: "Debugger", href: "/#/debugger", icon: "bug"},
  // { label: "Download", href: "/#/download", icon: "cloud-download" },
  // { label: "Settings", href: "/#/settings", icon: "gear" },
]);

let supportedPlattforms = reactive([
  {name: "ANNA"},
  {name: "ARM (64-bit)"},
]);
</script>
<template>
  <header>
    <div class="px-3 text-bg-dark">
      <div class="container-fluid">
        <div class="d-flex flex-wrap align-items-center justify-content-center">
          <img
              class="d-flex align-items-center my-lg-0 me-lg-auto"
              href="/#"
              src="https://github.com/Blocksembler/blocksembler-frontend/raw/main/img/logo.png"
              width="150px"
              alt="Blocksembler Logo"/>


          <ul class="nav col-12 col-lg-auto my-2 my-md-0">
            <li v-for="item in menuItems">
              <a :href="item.href" class="nav-link text-white">
                <BaseIcon :name="item.icon"/>
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
h1 {
  font-family: "PressStart2P",sans-serif;
}

header div {
  height: 80px;
}
</style>
