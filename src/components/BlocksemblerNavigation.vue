<script lang="ts" setup>
import {codingWorkspaceState} from "@/state";
import {saveAs} from "file-saver";
import {downloadLogData, logEvent} from "@/logging";
import * as bootstrap from "bootstrap";
import NewProjectModal from "@/components/modals/NewProjectModal.vue";
import SettingsModal from "@/components/modals/SettingsModal.vue";
import {ref} from "vue";
import {BACKEND_DISABLED, RESOURCE_LINKS} from "@/config";

let resources = ref(RESOURCE_LINKS);

let exportProject = () => {
  let fileExtension = "asm";

  if ("fileExtension" in codingWorkspaceState.archPlugin) {
    fileExtension = codingWorkspaceState.archPlugin.fileExtension;
  }

  saveAs(new Blob([codingWorkspaceState.sourceCode]), `project-${Date.now()}.${fileExtension}`);
  logEvent('buttonClick', {'source': 'exportProjectButton'})
}

let exportLogData = () => {
  downloadLogData();
  logEvent('buttonClick', {'source': 'exportLogButton'})
}

let importProject = () => {
  let fileReader = new FileReader();

  fileReader.onload = (e: Event) => {

    const data: string | ArrayBuffer | null = (e.target as FileReader).result;

    if (!data) {
      throw Error('Unable to load project');
    }

    let sourceCode: string;

    if (typeof data === "string") {
      sourceCode = data as string;
    } else {
      console.log(data);
      sourceCode = new TextDecoder().decode(data as ArrayBuffer);
    }

    try {
      codingWorkspaceState.initWorkspace(sourceCode);
      logEvent('sourceCodeLoaded', {'content': sourceCode});
    } catch (e) {
      console.log(e);
      logEvent('sourceCodeLoadingFailed');
    }
  }

  logEvent('buttonClick', {'source': 'importProjectButton'})

  let fileInput: HTMLInputElement = document.getElementById("file-input") as HTMLInputElement;
  let files = fileInput.files;

  if (files && files.length > 0 && files[0]) {
    fileReader.readAsText(files[0]);
  }
}

let openNewProjectModal = () => {
  logEvent('buttonClick', {})

  const el = document.getElementById('newProjectModal')
  const consentModal = new bootstrap.Modal(el as Element);
  consentModal.show();
}

let createNewProject = () => {
  logEvent('newProjectCreated', {'source': 'createNewProjectButton'})
  codingWorkspaceState.initWorkspace("");
}

let openSettings = () => logEvent('buttonClick', {'source': 'settingsButton'});

let onModeChangeHandler = (e: Event) => {
  e.preventDefault();
  const switchElement = e.target as HTMLInputElement;

  if (switchElement.checked) {
    try {
      codingWorkspaceState.initWorkspace(codingWorkspaceState.sourceCode);
    } catch (err) {
      alert('Failed to translate code to blocks!');
      console.error(err);
      switchElement.checked = !switchElement.checked;
    }
  }

  codingWorkspaceState.blocksEnabled = switchElement.checked;
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
                  <a class="dropdown-item" href="#" @click=openNewProjectModal>
                    New Project
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" onclick="document.getElementById('file-input').click();">
                    Import Assembly Code
                    <input id="file-input" name="name" style="display: none;" type="file" @change="importProject"/>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click=exportProject>
                    Export Assembly Code
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-target="#settingsModal" data-bs-toggle="modal" href="#" @click=openSettings>
                Settings
              </a>
            </li>
            <li class="nav-item dropdown">
              <a aria-expanded="false" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#"
                 role="button">
                Resources
              </a>
              <ul class="dropdown-menu">
                <li v-for="resource in resources">
                  <a :href="resource.url" class="dropdown-item" target="_blank">
                    {{ resource.name }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <div v-if="BACKEND_DISABLED" class="form-check form-switch">
            <label class="form-check-label text-white" for="switchCheckDefault">Blockbased Mode</label>
            <input id="switchCheckDefault" checked class="form-check-input" role="switch" type="checkbox"
                   @change="onModeChangeHandler">
          </div>
        </div>
      </div>
    </nav>

    <!-- Modals -->
    <SettingsModal id="settingsModal"/>
    <NewProjectModal id="newProjectModal" :onCreateProject="createNewProject"/>
  </header>

</template>