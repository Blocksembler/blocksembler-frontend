<script lang="ts" setup>
import BaseModal from "@/components/base/BaseModal.vue";
import {deleteLogData} from "@/logging";
import {Ref, ref} from "vue";
import {Modal} from "bootstrap";
import {BACKEND_API_URL} from "@/config";

let props = defineProps<{
  id: string;
}>();

let tanCode: Ref<string> = ref<string>('');

const consentHandler = (): void => {
  const modalElement = document.getElementById('tan-modal') as HTMLElement;
  const modal = Modal.getInstance(modalElement);

  fetch(`${BACKEND_API_URL}/tans/${tanCode.value}`)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        throw Error('tan not found');
      })
      .then(json => {
        let valid_from: Date | undefined;
        let valid_to: Date | undefined;

        if (json.valid_from !== null) {
          valid_from = new Date(json.valid_from);
        }

        if (json.valid_to !== null) {
          valid_to = new Date(json.valid_to);
        }

        if (valid_from && valid_from > new Date()) {
          let tanInput = document.getElementById("tan-input") as HTMLInputElement;
          tanInput.classList.add("is-invalid");
          console.error("tan code not yet valid");
        } else if (valid_to && valid_to < new Date()) {
          let tanInput = document.getElementById("tan-input") as HTMLInputElement;
          tanInput.classList.add("is-invalid");
          console.error("tan code not valid anymore");
        } else {
          window.localStorage?.setItem('blocksembler-tan-code', tanCode.value);
          window.localStorage?.setItem('blocksembler-tracking-consent', 'true');
          modal?.hide();
        }
      })
      .catch(_err => {
            console.error('could not retrieve tan code information');
            let tanInput = document.getElementById("tan-input") as HTMLInputElement;
            tanInput.classList.add("is-invalid");
          }
      );
}

const submitHandler = (e: Event): void => {
  e.preventDefault();
}

</script>

<template>
  <BaseModal :id="props.id" data-bs-backdrop="static" data-bs-keyboard="false" savable>
    <template v-slot:default>

      <p id="tan-consent-desc" class="tan-muted">
        By entering your TAN and continuing, you consent that the app will send
        log data to the backend. Logs include</p>
      <ul>
        <li><strong>error messages</strong>,</li>
        <li><strong>workspace state snapshots on change</strong>, and</li>
        <li><strong>button clicks</strong>.</li>
      </ul>
      <p>
        All logged data is strictly associated with your TAN only and no personal data is stored.
      </p>
      <form class="needs-validation w-100" novalidate @submit="submitHandler">
        <input
            id="tan-input"
            v-model="tanCode"
            aria-required="true"
            class="form-control input w-100"
            inputmode="text"
            name="tan"
            placeholder="e.g. ABCD-1234"
            required
            type="text"
        />
        <div class="invalid-feedback">
          Please insert a valid TAN-Code
        </div>
      </form>

    </template>
    <template v-slot:header>
      <div class="d-flex w-100 justify-content-start align-items-baseline">
        <h3 class="my-2">Data Usage Consent</h3>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="btn btn-primary" type="submit" @click="consentHandler">
        I consent
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>