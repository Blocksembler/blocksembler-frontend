<script lang="ts" setup>

import BaseModal from "@/components/base/BaseModal.vue";
import {onMounted} from "vue";
import {codingWorkspaceState} from "@/state";
import {BACKEND_API_URL} from "@/config";

const onShown = () => {
  const currentSolution = codingWorkspaceState.sourceCode;
  const tanCode = window.localStorage?.getItem("blocksembler-tan-code");

  if (!tanCode) {
    console.error("tan code not found");
    return;
  }

  const exerciseEndpoint = `${BACKEND_API_URL}/exercises/current?tan_code=${tanCode}`
  const gradingEndpoint = `${BACKEND_API_URL}/grading-jobs`


  fetch(exerciseEndpoint).then(res => res.json()).then(exercise => {
    console.log("submit grading job for exercise ", exercise.id)
    fetch(gradingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tan_code: tanCode,
        exercise_id: exercise.id,
        solution_code: currentSolution,
      })
    }).then(() => {
      setInterval(() => {
        console.log("fetching grading job status")
      }, 1000)
    })
  }).catch(error => {
    console.error(error)
  })
}

onMounted(() => {
  const modal = document.getElementById('submission-modal') as HTMLElement
  modal.addEventListener('shown.bs.modal', onShown);
})
</script>

<template>
  <BaseModal id="submission-modal" data-bs-backdrop="static" savable>
    <template v-slot:header>
      <div class="d-flex w-100 justify-content-start align-items-baseline">
        <h3 class="my-2">Grading Submission...</h3>
      </div>
    </template>
    <template v-slot:default>
      <p>
        Your submission is being graded. Please wait.
      </p>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>