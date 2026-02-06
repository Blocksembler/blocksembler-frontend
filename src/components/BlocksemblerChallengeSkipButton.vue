<script lang="ts" setup>

import SkipForwardIcon from "@/components/icons/SkipForwardIcon.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import {computed} from "vue";
import {FINAL_EXERCISE, skipExercise} from "@/api/exercises";
import {formatTime} from "@/util/time";
import {codingWorkspaceState} from "@/state";

const props = defineProps(['remainingTime']);

const emit = defineEmits([
  'skipSuccessful',
  'skipFailed',
])

let allowSkip = computed(() => {
  return !(props.remainingTime === null || props.remainingTime > 0);
})

let skip = async () => {
  if (await skipExercise()) {
    emit("skipSuccessful");
  } else {
    emit("skipFailed");
  }
}
</script>

<template>
  <BaseButton :disabled="!allowSkip || codingWorkspaceState.currentExercise?.id === FINAL_EXERCISE.id" @click="skip">
    <SkipForwardIcon/>
    Skip Exercise <span v-if="!allowSkip">({{ formatTime(remainingTime) }})</span>
  </BaseButton>
</template>

<style scoped>

</style>