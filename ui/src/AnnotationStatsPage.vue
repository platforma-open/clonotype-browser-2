<script setup lang="ts">
import { type PTableColumnSpec } from '@platforma-sdk/model';
import {
  PlBlockPage,
  PlTableFilters,
  PlAgDataTableToolsPanel,
  PlBtnGhost,
  PlAgDataTableV2,
  usePlDataTableSettingsV2,
} from '@platforma-sdk/ui-vue';
import { ref } from 'vue';
import { useApp } from './app';
import AnnotationsModal from './Annotations/AnnotationsModal.vue';

const app = useApp();

const tableSettings = usePlDataTableSettingsV2({
  sourceId: () => app.model.args.annotationScript.steps.length > 0 ? app.model.args.annotationScript.steps : undefined,
  model: () => app.model.outputs.statsTable,
});

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
      <PlAgDataTableV2
        ref="tableInstance"
        v-model="app.model.ui.statsTable.tableState"
        :settings="tableSettings"
        show-columns-panel
        show-export-button
        @columns-changed="(info) => (columns = info.columns)"
      />
    </div>
  </PlBlockPage>
  <AnnotationsModal />
</template>
