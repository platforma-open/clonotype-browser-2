<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  PlSlideModal,
  PlBtnGroup,
  PlBtnSecondary,
  PlIcon16,
  type SimpleOption,
  PlEditableTitle,
} from '@platforma-sdk/ui-vue';
import type { AnnotationScriptUi, AnnotationMode } from '@platforma-open/milaboratories.clonotype-browser-2.model';
import { useApp } from '../app';
import { compileAnnotationScript } from '@platforma-open/milaboratories.clonotype-browser-2.model';
import { getDefaultAnnotationScript } from './getDefaultAnnotationScript';
import { watchDebounced, useEventListener } from '@vueuse/core';
import { provideCommonState } from './commonState';
import StepsList from './StepsList.vue';
const app = useApp();

const form = ref<AnnotationScriptUi>(app.model.ui.annotationScript);

const commonState = provideCommonState();

watch(() => app.model.ui.annotationScript, (annotationScript) => {
  if (annotationScript === undefined) {
    annotationScript = getDefaultAnnotationScript();
  }
  form.value = JSON.parse(JSON.stringify(annotationScript));
}, { immediate: true, deep: true });

watchDebounced(form, (value, oldValue) => {
  if (value && (value === oldValue)) { // same ref
    try {
      const compiled = compileAnnotationScript(value);
      app.model.ui.annotationScript = value;
      app.model.args.annotationScript = compiled;
    } catch (e) {
      console.error(e);
    }
  }
}, { deep: true, debounce: 2000 });

const addStep = () => {
  if (!form.value) {
    return;
  }

  form.value.steps.push({
    label: `Label #${form.value.steps.length + 1}`,
    filter: {
      type: 'and',
      filters: [],
    },
  });

  commonState.value.editStepModalIndex = form.value.steps.length - 1;
};

const removeStep = (index: number) => {
  if (!form.value) {
    return;
  }
  form.value.steps = form.value.steps.filter((_, i) => i !== index);
};

const reorderSteps = (indices: number[]) => {
  if (!form.value) {
    return;
  }

  form.value.steps = indices.map((i) => form.value!.steps[i]);
};

const groupOptions = [
  { label: 'Global', value: 'byClonotype' },
  { label: 'Per sample', value: 'bySampleAndClonotype' },
] satisfies SimpleOption<AnnotationMode>[];

useEventListener(document.body, 'click', (ev) => {
  const target = ev.target as HTMLElement;

  if (target.closest('.pl-slide-modal') || target.closest('.pl-app-notification-alert')) {
    return;
  }

  if (commonState.value.editStepModalIndex !== undefined) {
    commonState.value.editStepModalIndex = undefined;
  } else if (commonState.value.addFilterModalIndex !== undefined) {
    commonState.value.addFilterModalIndex = undefined;
  } else {
    app.isAnnotationModalOpen = false;
  }
});
</script>

<template>
  <PlSlideModal ref="modal" v-model="app.isAnnotationModalOpen" :close-on-outside-click="false">
    <template #title>
      <PlEditableTitle
        v-model="form.title"
        :max-length="40"
        max-width="600px"
        placeholder="Annotation Name"
      />
    </template>
    <template v-if="form">
      <PlBtnGroup v-model="form.mode" :options="groupOptions" />
      <div :class="$style.steps">
        <StepsList :key="form.steps.length" :steps="form.steps" @delete="removeStep" @reorder="reorderSteps" />
        <PlBtnSecondary :class="$style.addStepBtn" @click="addStep">
          <PlIcon16 name="add" style="margin-right: 8px;" />
          Add annotation
        </PlBtnSecondary>
      </div>
    </template>
  </PlSlideModal>
</template>

<style module>
.steps {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.addStepBtn {
  border: 1px dashed #E1E3EB;
}
</style>
