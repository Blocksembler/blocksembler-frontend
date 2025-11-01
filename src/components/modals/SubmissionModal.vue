<script lang="ts" setup>

import BaseModal from "@/components/base/BaseModal.vue";
import {onMounted, ref} from "vue";
import {codingWorkspaceState} from "@/state";
import {BACKEND_API_URL} from "@/config";

const gradingEndpoint = `${BACKEND_API_URL}/grading-jobs`
let gradingStatusText = ref(
    "<div class=\"spinner-border text-dark me-2\" role=\"status\">" +
    "<span class=\"visually-hidden\">Loading...</span></div>" +
    "Your submission is being graded. Please wait."
);

interface GradingJob {
  id: string,
  tan_code: string,
  exercise_id: number,
  status: string,
  started: string,
  terminated: string,
  passed: boolean,
  feedback: [string]
}

const submitSolution = async (tanCode: string, exerciseId: number, solutionCode: string) => {
  const jobId: string = await fetch(gradingEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tan_code: tanCode,
      exercise_id: exerciseId,
      solution_code: solutionCode,
    })
  }).then(response => response.json());

  console.log(`Job ${jobId} was submitted.`);
  return jobId;
}

const getJobStatus = async (jobId: string): Promise<GradingJob> => {
  const gradingJobEndpoint = `${BACKEND_API_URL}/grading-jobs/${jobId}`;
  return await fetch(gradingJobEndpoint).then(response => response.json())
}

const pollJobStatus = async (jobId: string) => {
  let jobStatus: GradingJob = await getJobStatus(jobId);
  console.log(`Job status: ${jobStatus.status}`);

  while (jobStatus.status != "done") {
    await new Promise(r => setTimeout(r, 1000));
    jobStatus = await getJobStatus(jobId);
    console.log(`Job status: ${jobStatus.status}`);
  }

  if (jobStatus.passed) {
    gradingStatusText.value = "🚀 Congratulation! " +
        "Your Submission passed all tests! \n " +
        "Reload exercise page to proceed with the next exercise.";
  } else {
    gradingStatusText.value = "💡 Almost there! " +
        "Some test cases didn’t pass yet " +
        "— take another look and try to fix the remaining issues."
  }
}

const getCurrentExerciseId = async (tanCode: string): Promise<number | null> => {
  const exerciseEndpoint = `${BACKEND_API_URL}/exercises/current?tan_code=${tanCode}`;
  return await fetch(exerciseEndpoint).then(async (response) => {
    if (response.status == 200) {
      const exercise = await response.json();
      return exercise.id;
    }

    return null;
  })
}

const onShown = async () => {
  const currentSolution = codingWorkspaceState.sourceCode;
  const tanCode = window.localStorage?.getItem("blocksembler-tan-code");

  if (!tanCode) {
    console.error("tan code not found");
    return;
  }

  const exerciseId = await getCurrentExerciseId(tanCode);
  console.log(`Current Exercise: ${exerciseId}`);

  if (exerciseId) {
    const jobId = await submitSolution(tanCode, exerciseId, currentSolution);
    await pollJobStatus(jobId);
  }
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
      <p v-html="gradingStatusText"/>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>