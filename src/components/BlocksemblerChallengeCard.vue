<script lang="ts" setup>

import BaseButton from "@/components/base/BaseButton.vue";
import {computed, onMounted, Ref, ref} from "vue";
import {marked} from "marked";
import katexExtension from "marked-katex-extension";
import "katex/dist/katex.min.css";
import ReplyIcon from "@/components/icons/ReplyIcon.vue";
import BlocksemblerCodeSubmissionButton from "@/components/BlocksemblerCodeSubmissionButton.vue";
import {codingWorkspaceState} from "@/state";
import {getCurrentExercise} from "@/api/exercises";
import BlocksemblerChallengeSkipButton from "@/components/BlocksemblerChallengeSkipButton.vue";

let nextSkipAllowedAt: Ref<Date | null> = ref(null);
let remainingTimeToNextSkip: Ref<number | null> = ref(null);
let timeToNextSkipTimer: Ref<number | null> = ref(null);

let nextSubmissionAllowedAt: Ref<Date> = ref(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7));
let remainingTimeToNextSubmission: Ref<number | null> = ref(null);
let timeToNextSubmissionTimer: Ref<number | null> = ref(null);

onMounted(async () => {
  marked.use(
      katexExtension({
        throwOnError: false,
      })
  );

  await loadCurrentExercise();
})


let markdownToHtml = computed(() => {
  if (codingWorkspaceState.currentExercise === null) {
    return ""
  }

  return marked(codingWorkspaceState.currentExercise.markdown);
})

const updateRemainingtimeToNextSkip = () => {
  if (nextSkipAllowedAt.value) {
    const remaining = nextSkipAllowedAt.value.getTime() - new Date().getTime()
    remainingTimeToNextSkip.value = Math.max(0, remaining);
  }

  if (remainingTimeToNextSkip.value == 0) {
    if (timeToNextSkipTimer.value) {
      window.clearInterval(timeToNextSkipTimer.value);
    }
  }
}

const updateRemainingTimeToNextSubmission = () => {
  if (nextSubmissionAllowedAt.value) {
    const remaining = nextSubmissionAllowedAt.value.getTime() - new Date().getTime()
    remainingTimeToNextSubmission.value = Math.max(0, remaining);
  }

  if (remainingTimeToNextSubmission.value == 0) {
    if (timeToNextSubmissionTimer.value) {
      window.clearInterval(timeToNextSubmissionTimer.value);
    }
  }
}

const loadCurrentExercise = async () => {
  codingWorkspaceState.currentExercise = await getCurrentExercise();
  const challenge = codingWorkspaceState.currentExercise;

  if (timeToNextSkipTimer.value) clearInterval(timeToNextSkipTimer.value);
  if (timeToNextSubmissionTimer.value) clearInterval(timeToNextSubmissionTimer.value);

  if (challenge.skip_unlock_time) {
    nextSkipAllowedAt.value = new Date(challenge.skip_unlock_time);
  }

  if (challenge.next_grading_allowed_at) {
    nextSubmissionAllowedAt.value = new Date(challenge.next_grading_allowed_at);
  }

  updateRemainingtimeToNextSkip();
  timeToNextSkipTimer.value = window.setInterval(updateRemainingtimeToNextSkip, 1000);

  updateRemainingTimeToNextSubmission();
  timeToNextSubmissionTimer.value = window.setInterval(updateRemainingTimeToNextSubmission, 1000);
}

const testsPassed = async () => {
  const alertEl = document.getElementById("testsPassedAlert");

  if (!alertEl) return;

  alertEl.classList.remove("d-none");

  setTimeout(() => {
    loadCurrentExercise();
  }, 1000);

  setTimeout(() => {
    alertEl.classList.add("d-none");
  }, 10000);
};

const testsFailed = async () => {
  const alertEl = document.getElementById("testsFailedAlert");
  if (!alertEl) return;

  alertEl.classList.remove("d-none");
  alertEl.classList.add("show");

  setTimeout(() => {
    alertEl.classList.remove("show");
    alertEl.classList.add("d-none");
  }, 10000);

  await loadCurrentExercise();
};

const submissionFailed = async () => {
  const alertEl = document.getElementById("submissionFailedAlert");
  if (!alertEl) return;

  alertEl.classList.remove("d-none");
  alertEl.classList.add("show");

  setTimeout(() => {
    alertEl.classList.remove("show");
    alertEl.classList.add("d-none");
  }, 10000);
};

const skipSuccessful = () => {
  loadCurrentExercise();
}

const skipFailed = () => {
  const alertEl = document.getElementById("skipFailedAlert");
  if (!alertEl) return;

  alertEl.classList.remove("d-none");
  alertEl.classList.add("show");

  setTimeout(() => {
    alertEl.classList.remove("show");
    alertEl.classList.add("d-none");
  }, 10000);
}

</script>

<template>
  <div class="challenge-card">
    <div id="challenge-card-actions">
      <BaseButton @click="loadCurrentExercise">
        <ReplyIcon/>
        Reload Task
      </BaseButton>

      <BlocksemblerCodeSubmissionButton :remainingTime="remainingTimeToNextSubmission"
                                        @submissionFailed="submissionFailed"
                                        @testsFailed="testsFailed"
                                        @testsPassed="testsPassed"/>

      <BlocksemblerChallengeSkipButton :remainingTime="remainingTimeToNextSkip"
                                       @skipFailed="skipFailed"
                                       @skipSuccessful="skipSuccessful"/>
    </div>

    <div>
      <div id="testsPassedAlert" class="alert alert-success d-none" role="alert">
        ✅ Submission successful!
      </div>
      <div id="testsFailedAlert" class="alert alert-warning d-none" role="alert">
        ⚠️ The submitted code did not pass the tests! Keep up your efford, you are nearly there!
      </div>
      <div id="submissionFailedAlert" class="alert alert-danger d-none" role="alert">
        ❌ Failed to submit code!
      </div>
      <div id="skipFailedAlert" class="alert alert-danger d-none" role="alert">
        ❌ Failed to skip exercise!
      </div>
    </div>

    <div v-if="!codingWorkspaceState.currentExercise" id="challenge-loading-spinner"
         class="d-flex align-items-center justify-content-center">
      <span class="m-4">Loading next challenge</span>
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-if="codingWorkspaceState.currentExercise" id="challenge-description">
      <div class="markdown-div" v-html="markdownToHtml">
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenge-card {
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

.markdown-div :deep(pre) {
  background: #444444;
  padding: 12px 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.markdown-div :deep(pre, code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  color: white;
}

</style>