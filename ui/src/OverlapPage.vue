<script setup lang="ts">
import type { PlRef, PTableColumnSpec } from '@platforma-sdk/model';

import {
  PlBlockPage,
  PlBtnGhost,
  PlDropdownRef,
  PlSlideModal,
  PlTableFilters,
  type PlAgDataTableSettings,
  PlAgDataTableToolsPanel,
  PlAgDataTableV2 as PlAgDataTable,
} from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from './app';
import { AnnotationsModal } from '@platforma-sdk/ui-vue';
import ExportBtn from './ExportBtn.vue';

const app = useApp();

function setAnchorColumn(ref: PlRef | undefined) {
  app.model.args.inputAnchor = ref;
}

const tableSettings = computed<PlAgDataTableSettings | undefined>(() =>
  app.model.args.inputAnchor
    ? {
        sourceType: 'ptable',
        model: app.model.outputs.overlapTable,
      }
    : undefined,
);
const columns = ref<PTableColumnSpec[]>([]);
</script>

<template>
  <PlBlockPage>
    <template #title>
      Overlap Clonotypes Browser
    </template>
    <template #append>
      <PlAgDataTableToolsPanel>
        <PlTableFilters v-model="app.model.ui.overlapTable.filterModel" :columns="columns" />
      </PlAgDataTableToolsPanel>
      <ExportBtn />
      <PlBtnGhost icon="settings" @click.stop="app.isAnnotationModalOpen.value = true">
        Annotations
      </PlBtnGhost>
      <PlBtnGhost icon="settings" @click.exact.stop="() => (app.model.ui.settingsOpen = true)">
        Settings
      </PlBtnGhost>
    </template>
    <div style="flex: 1">
      <PlAgDataTable
        ref="tableInstance"
        v-model="app.model.ui.overlapTable.tableState"
        :settings="tableSettings"
        show-columns-panel
        @columns-changed="(newColumns) => (columns = newColumns)"
      />
    </div>
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
