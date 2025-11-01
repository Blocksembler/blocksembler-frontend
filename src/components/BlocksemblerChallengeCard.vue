<script lang="ts" setup>

import BaseButton from "@/components/base/BaseButton.vue";
import TrophyIcon from "@/components/icons/TrophyIcon.vue";
import SkipForwardIcon from "@/components/icons/SkipForwardIcon.vue";
import {computed, onMounted, ref} from "vue";
import {marked} from "marked";
import {Modal} from "bootstrap";
import ReplyIcon from "@/components/icons/ReplyIcon.vue";
import {BACKEND_API_URL} from "@/config";

let allExercisesSolvedPage = "# 🎉 Congratulations! 🎉\n" +
    "\n" +
    "You did it — you have successfully solved **all exercises** in this competition! 🏆  \n\n" +
    "Thank you for participating!  \n" +
    "Keep learning, keep exploring — and see you in the next competition. 🚀  ";

let errorPage =
    "# ⚠️ Exercise Unavailable\n" +
    "\n" +
    "Sorry, this exercise **can’t be loaded right now.** 😕\n" +
    "\n" +
    "This might be due to one of the following reasons:\n" +
    "- The TAN code stored in your browser is invalid\n" +
    "- The competition has ended or is currently locked\n" +
    "- A temporary connection or server issue occurred\n" +
    "\n" +
    "Please try reloading the page. If the problem persists, contact your system administrator.";

let allowSubmission = ref(true);

let markdown = ref("");
let markdownToHtml = computed(() => {
  return marked(markdown.value);
})

const loadCurrentExercise = async () => {
  document.getElementById("challenge-loading-spinner")?.classList.remove("d-none");
  document.getElementById("challenge-description")?.classList.add("d-none");

  const tan = window.localStorage?.getItem("blocksembler-tan-code");
  fetch(`${BACKEND_API_URL}/exercises/current?tan_code=${tan}`).then(res => {
    if (res.status === 200) {
      allowSubmission.value = true;
      return res.json();
    } else if (res.status === 204) {
      allowSubmission.value = false;
      return {"markdown": allExercisesSolvedPage}
    }
    return {"markdown": errorPage};
  }).then(challenge => {
    document.getElementById("challenge-loading-spinner")?.classList.toggle("d-none");
    markdown.value = challenge.markdown;
    document.getElementById("challenge-description")?.classList.toggle("d-none");
  }).catch(error => {
    console.log(error);
  });
}

onMounted(async () => {
  await loadCurrentExercise();
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
      <BaseButton @click="loadCurrentExercise">
        <ReplyIcon/>
        Reload
      </BaseButton>
      <BaseButton :disabled="!allowSubmission" @click="submitSolution">
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