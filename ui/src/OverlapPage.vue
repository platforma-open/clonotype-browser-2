<script setup lang="ts">
import type { PlRef } from '@platforma-sdk/model';

import {
  PlBlockPage,
  PlBtnGhost,
  PlDropdownRef,
  PlSlideModal,
  PlAgDataTableV2,
  usePlDataTableSettingsV2,
} from '@platforma-sdk/ui-vue';
import { useApp } from './app';
import { AnnotationsModal } from '@platforma-sdk/ui-vue';
import ExportBtn from './ExportBtn.vue';

const app = useApp();

function setAnchorColumn(ref: PlRef | undefined) {
  app.model.args.inputAnchor = ref;
}

const tableSettings = usePlDataTableSettingsV2({
  sourceId: () => app.model.args.inputAnchor,
  model: () => app.model.outputs.overlapTable,
});
</script>

<template>
  <PlBlockPage>
    <template #title>
      Overlap Clonotypes Browser
    </template>
    <template #append>
      <ExportBtn />
      <PlBtnGhost icon="settings" @click.stop="app.isAnnotationModalOpen.value = true">
        Annotations
      </PlBtnGhost>
      <PlBtnGhost icon="settings" @click.exact.stop="() => (app.model.ui.settingsOpen = true)">
        Settings
      </PlBtnGhost>
    </template>
    <PlAgDataTableV2
      ref="tableInstance"
      v-model="app.model.ui.overlapTable.tableState"
      :settings="tableSettings"
    />
  </PlBlockPage>
  <PlSlideModal v-model="app.model.ui.settingsOpen" :close-on-outside-click="true">
    <template #title>Settings</template>
    <PlDropdownRef
      :options="app.model.outputs.inputOptions"
      :model-value="app.model.args.inputAnchor"
      label="Select dataset"
      clearable
      @update:model-value="setAnchorColumn"
    />
  </PlSlideModal>
  <AnnotationsModal
    v-model:ui="app.model.ui.annotationScript"
    v-model:args="app.model.args.annotationScript"
    v-model:opened="app.isAnnotationModalOpen.value"
    :columns="app.filterColumns.value"
  />
</template>
