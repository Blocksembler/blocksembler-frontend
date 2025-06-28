<script setup>
import BaseModal from "@/components/modals/BaseModal.vue";

const props = defineProps({
  onCreateProject: {
    type: Function,
    required: true
  }
});

</script>

<template>
  <BaseModal id="settingsModal" data-bs-backdrop="static" savable title="Settings">
    <template v-slot:default>
      <p>Creating a new project will erase your current workspace. To avoid losing your data, please download your current project before proceeding.</p>
    </template>
    <template v-slot:header>
      <div class="d-flex w-100 justify-content-start align-items-baseline">
        <h3 class="my-2">⚠️ Project Creation Will Clear Your Workspace!</h3>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="btn btn-danger" data-bs-dismiss="modal" @click="props.onCreateProject">
        Erase Workspace & Create New Project
      </button>
      <button class="btn btn-primary" data-bs-dismiss="modal">
        Cancel
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>