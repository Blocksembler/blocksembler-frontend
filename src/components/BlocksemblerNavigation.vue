<script setup>
import {codingWorkspaceState} from "@/state.js";
import {saveAs} from "file-saver";
import {downloadLogData, logEvent} from "@/logging.js";
import CloudDownloadIcon from "@/components/icons/CloudDownloadIcon.vue";
import * as bootstrap from "bootstrap";
import NewProjectModal from "@/components/modals/NewProjectModal.vue";
import SettingsModal from "@/components/modals/SettingsModal.vue";

let emit = defineEmits(['importProject', 'exportProject']);

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

  fileReader.onload = (e) => {
    const sourceCode = e.target.result;
    try {
      codingWorkspaceState.initWorkspace(sourceCode);
      logEvent('sourceCodeLoaded', {'content': sourceCode});
    } catch (e) {
      console.log(e);
      logEvent('sourceCodeLoadingFailed');
    }
  }

  logEvent('buttonClick', {'source': 'importProjectButton'})
  fileReader.readAsText(document.getElementById("file-input").files[0]);
}

let openNewProjectModal = () => {
  logEvent('buttonClick', {'source': 'createNewProjectButton'})
  const consentModal = new bootstrap.Modal(document.getElementById('newProjectModal'));
  consentModal.show();
}

let createNewProject = () => {
  logEvent('newProjectCreated', {'source': 'createNewProjectButton'})
  codingWorkspaceState.initWorkspace("");
}

let editCode = () => logEvent('buttonClick', {'source': 'editCodeButton'});

let debugCode = () => logEvent('buttonClick', {'source': 'debugCodeButton'});

let openSettings = () => logEvent('buttonClick', {'source': 'settingsButton'});

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
              <a class="nav-link" href="/#/editor" @click=editCode>
                Edit Code
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/#/debugger" @click=debugCode>
                Run Code
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-target="#settingsModal" data-bs-toggle="modal" href="#" @click=openSettings>
                Settings
              </a>
            </li>
            <li class="nav-item d-inline d-lg-none">
              <a class="nav-link" data-bs-target="#settingsModal" data-bs-toggle="modal" href="#" @click=openSettings>
                Download Log Data
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button class="btn btn-outline-secondary text-nowrap me-2 d-none d-lg-inline" @click="exportLogData">
        <CloudDownloadIcon/>
        Download Log Data
      </button>
    </nav>

    <!-- Modals -->
    <SettingsModal id="settingsModal"/>
    <NewProjectModal id="newProjectModal" :onCreateProject="createNewProject"/>
  </header>

</template>