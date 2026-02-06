<script lang="ts" setup>

import BaseButton from "@/components/base/BaseButton.vue";
import TrophyIcon from "@/components/icons/TrophyIcon.vue";
import {computed, ref} from "vue";
import {getGradingJob, GradingJob, submitGradingJob} from "@/api/gradingJob";
import {codingWorkspaceState} from "@/state";
import {formatTime} from "@/util/time";
import {FINAL_EXERCISE} from "@/api/exercises";

const props = defineProps(['remainingTime']);
const emit = defineEmits([
  'testsPassed',
  'testsFailed',
  'submissionFailed'
])

let isSubmitting = ref(false);

let allowSubmission = computed(() => {
  return !(props.remainingTime && props.remainingTime > 0);
})

let submitCode = async () => {
  if (codingWorkspaceState.currentExercise == null || codingWorkspaceState.currentExercise.id == null) {
    console.log("no active exercise detected");
    return;
  }

  isSubmitting.value = true;

  const exerciseId = codingWorkspaceState.currentExercise.id;
  const sourceCode = codingWorkspaceState.sourceCode;

  try {
    let jobId = await submitGradingJob(exerciseId, sourceCode);
    let submissionPassed = await pollJobStatus(jobId);

    if (submissionPassed) {
      emit('testsPassed');
    } else {
      emit('testsFailed');
    }

  } catch (error) {
    console.error(error);
    emit('submissionFailed');
  } finally {
    isSubmitting.value = false;
  }

}

const pollJobStatus = async (jobId: string) => {
  let job: GradingJob = await getGradingJob(jobId);
  console.log(`Job status: ${job.status}`);

  while (job.status != "done") {
    await new Promise(r => setTimeout(r, 1000));
    job = await getGradingJob(jobId);
    console.log(`Job status: ${job.status}`);
  }

  return job.passed;
}

</script>

<template>
  <BaseButton
      :disabled="isSubmitting || !allowSubmission || codingWorkspaceState.currentExercise?.id === FINAL_EXERCISE.id"
      @click="submitCode">
    <TrophyIcon v-if="!isSubmitting"/>
    <span v-if="isSubmitting" aria-hidden="true" class="spinner-border spinner-border-sm me-2" role="status"></span>
    <span> Submit Solution</span>
    <span v-if="!allowSubmission">({{ formatTime(remainingTime) }})</span>
  </BaseButton>
</template>

<style scoped>

</style>