<script setup>
import {reactive} from "vue";
import BaseIcon from "./BaseIcon.vue";
import {saveAs} from "file-saver";
import {load, save} from "../util/serialization.js";
import {jsonWorkspace} from "../state.js";

let menuItems = reactive([
  {label: "Editor", href: "/#/editor", icon: "pencil"},
  {label: "Debugger", href: "/#/debugger", icon: "bug"},
]);

let export_project = () => {
  saveAs(new Blob([JSON.stringify(load())]), `blocksembler-project-${Date.now()}.json`)
}

let import_project = () => {
  let fileReader = new FileReader();

  fileReader.onload = (e) => {
    jsonWorkspace.value = JSON.parse(e.target.result)
    save(jsonWorkspace.value)
  }

  fileReader.readAsText(document.getElementById("file-input").files[0]);
}

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
            <li>
              <a href="#" class="nav-link text-white" @click="export_project">
                <BaseIcon name="cloud-download"/>
                Export Project
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white" onclick="document.getElementById('file-input').click();">
                <BaseIcon name="cloud-download"/>
                Import Project
                <input id="file-input" type="file" name="name" style="display: none;" @change="import_project"/>
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
  font-family: "PressStart2P", sans-serif;
}

header div {
  height: 100px;
}
</style>
