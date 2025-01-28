<script setup>
import PencilIcon from "@/components/icons/PencilIcon.vue";
import BugIcon from "@/components/icons/BugIcon.vue";
import CloudDownloadIcon from "@/components/icons/CloudDownloadIcon.vue";
import GearIcon from "@/components/icons/GearIcon.vue";
import CloudUploadIcon from "@/components/icons/CloudUploadIcon.vue";

let emit = defineEmits(['importProject', 'exportProject']);

let export_project = () => {
  emit('exportProject');
}

let import_project = () => {
  let fileReader = new FileReader();

  fileReader.onload = (e) => {
    const sourceCode = e.target.result;
    emit('importProject', sourceCode);
    console.log('emit importProject Event');
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
            <li>
              <a href="/#/editor" class="nav-link text-white">
                <PencilIcon class="d-block mx-auto mb-1"/>
                Editor
              </a>
            </li>
            <li>
              <a href="/#/debugger" class="nav-link text-white">
                <BugIcon class="d-block mx-auto mb-1"/>
                Debugger
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white" @click="export_project">
                <CloudDownloadIcon class="d-block mx-auto mb-1"/>
                Export Project
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white" onclick="document.getElementById('file-input').click();">
                <CloudUploadIcon class="d-block mx-auto mb-1"/>
                Import Project
                <input id="file-input" type="file" name="name" style="display: none;" @change="import_project"/>
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white" data-bs-target="#settingsModal" data-bs-toggle="modal">
                <GearIcon class="d-block mx-auto mb-1"/>
                Settings
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header div {
  height: 100px;
}
</style>
