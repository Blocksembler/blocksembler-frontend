<script setup>
import {codingWorkspaceState} from "@/state.js";
import {saveAs} from "file-saver";

let emit = defineEmits(['importProject', 'exportProject']);

let exportProject = () => {
  saveAs(new Blob([codingWorkspaceState.sourceCode]), `project-${Date.now()}.s`);
}

let importProject = () => {
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
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <img
            alt="Blocksembler Logo"
            class="navbar-brand"
            height="50px"
            href="/#"
            src="https://github.com/Blocksembler/blocksembler-frontend/raw/main/img/logo.png"/>
        <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                class="navbar-toggler"
                data-bs-target="#navbarSupportedContent" data-bs-toggle="collapse" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarSupportedContent" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a aria-expanded="false" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#"
                 role="button">
                File
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" onclick="document.getElementById('file-input').click();">
                    Import Project
                    <input id="file-input" name="name" style="display: none;" type="file" @change="importProject"/>
                  </a>
                </li>
                <li><a class="dropdown-item" href="#" @click=exportProject>Export</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/#/editor">
                Edit Code
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/#/debugger">
                Run Code
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Settings</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

</template>