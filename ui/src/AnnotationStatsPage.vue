<script setup lang="ts">
import type { PTableColumnSpec } from '@platforma-sdk/model';
import {
  PlAgDataTable,
  PlBlockPage,
  PlTableFilters,
  type PlDataTableSettings,
  PlAgDataTableToolsPanel,
  PlBtnGhost,
} from '@platforma-sdk/ui-vue';
import { AnnotationsModal } from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from './app';

const app = useApp();

const tableSettings = computed<PlDataTableSettings | undefined>(() =>
  app.model.args.annotationScript.steps.length > 0
    ? {
        sourceType: 'ptable',
        pTable: app.model.outputs.statsTable,
      }
    : undefined,
);
const columns = ref<PTableColumnSpec[]>([]);
</script>

<template>
  <PlBlockPage>
    <template #title>
      Annotation Stats - {{ app.model.args.annotationScript.title }}
    </template>
    <template #append>
      <PlAgDataTableToolsPanel>
        <PlTableFilters v-model="app.model.ui.statsTable.filterModel" :columns="columns" />
      </PlAgDataTableToolsPanel>
      <PlBtnGhost icon="settings" @click.stop="app.isAnnotationModalOpen = true">
        Annotations
      </PlBtnGhost>
    </template>
    <div style="flex: 1">
      <PlAgDataTable
        ref="tableInstance"
        v-model="app.model.ui.statsTable.tableState"
        :settings="tableSettings"
        show-columns-panel
        show-export-button
        @columns-changed="(newColumns) => (columns = newColumns)"
      />
    </div>
  </PlBlockPage>
  <AnnotationsModal
    v-model:ui="app.model.ui.annotationScript"
    v-model:args="app.model.args.annotationScript"
    v-model:opened="app.isAnnotationModalOpen"
    :columns="app.filterColumns"
  />
</template>
