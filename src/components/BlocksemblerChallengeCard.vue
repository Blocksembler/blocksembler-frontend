<script lang="ts" setup>

import BaseButton from "@/components/base/BaseButton.vue";
import TrophyIcon from "@/components/icons/TrophyIcon.vue";
import SkipForwardIcon from "@/components/icons/SkipForwardIcon.vue";
import {computed, onMounted, ref} from "vue";
import {marked} from "marked";
import {Modal} from "bootstrap";

let baseUrl = window.env['BACKEND_API_URL'] || "localhost:8081";

let markdown = ref("");
let markdownToHtml = computed(() => {
  return marked(markdown.value);
})

onMounted(() => {
  const tan = window.localStorage?.getItem("blocksembler-tan-code");
  fetch(`http://${baseUrl}/exercises/current?tan_code=${tan}`).then(res => res.json()).then(challenge => {
    document.getElementById("challenge-loading-spinner")?.classList.toggle("d-none");
    markdown.value = challenge.markdown;
    document.getElementById("challenge-description")?.classList.toggle("d-none");
  }).catch(() => {
    alert("failed to load challenge");
  });
})

const submitSolution = () => {
  const el = document.getElementById("submission-modal");
  const modal = new Modal(el as Element);
  modal.toggle();
}

</script>

<template>
  <div class="challenge-card">
    <div id="challenge-card-actions">
      <BaseButton @click="submitSolution">
        <TrophyIcon/>
        Submit Current Solution
      </BaseButton>
      <BaseButton disabled>
        <SkipForwardIcon/>
        Skip Exercise
      </BaseButton>
    </div>
    <div id="challenge-loading-spinner" class="d-flex align-items-center justify-content-center">
      <span class="m-4">Loading next challenge</span>
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div id="challenge-description" class="d-none">
      <div v-html="markdownToHtml">
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenge-card {
  background-color: lightgray;
  height: calc(100vh - 66px);
  width: 100%;
  margin: 0;
  padding: 0;
}

.challenge-card #challenge-card-actions {
  display: flex;
  padding: 1rem;

  height: 70px;
}

.challenge-card #challenge-description {
  max-height: calc(100% - 70px);
  padding: 1rem;

  overflow-y: scroll;
}

</style>