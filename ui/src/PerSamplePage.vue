<script setup lang="ts">
import { type PlRef, type PTableColumnSpec, plRefsEqual } from '@platforma-sdk/model';
import {
  PlBlockPage,
  PlBtnGhost,
  PlDropdownRef,
  PlSlideModal,
  PlTableFilters,
  PlAgDataTableToolsPanel,
  PlAgDataTableV2 as PlAgDataTable,
  usePlDataTableSettingsV2,
} from '@platforma-sdk/ui-vue';
import { ref } from 'vue';
import { useApp } from './app';
import { AnnotationsModal } from './Annotations';
import ExportBtn from './ExportBtn.vue';

const app = useApp();

function setAnchorColumn(ref: PlRef | undefined) {
  app.model.args.inputAnchor = ref;
  if (ref) {
    app.model.args.datasetTitle = app.model.outputs.inputOptions?.find((o) => plRefsEqual(o.ref, ref))?.label;
  } else {
    app.model.args.datasetTitle = undefined;
  }
}

const tableSettings = usePlDataTableSettingsV2({
  sourceId: () => app.model.args.inputAnchor,
  model: () => app.model.outputs.perSampleTable,
  sheets: () => app.model.outputs.perSampleTableSheets,
});
const columns = ref<PTableColumnSpec[]>([]);

</script>

<template>
  <PlBlockPage>
    <template #title>
      Per Sample Clonotype Browser
    </template>
    <template #append>
      <PlAgDataTableToolsPanel>
        <PlTableFilters v-model="app.model.ui.perSampleTable.filterModel" :columns="columns" />
      </PlAgDataTableToolsPanel>
      <ExportBtn />
      <PlBtnGhost icon="settings" @click.stop="app.isAnnotationModalOpen = true">
        Annotations
      </PlBtnGhost>
      <PlBtnGhost icon="settings" @click.exact.stop="() => (app.model.ui.settingsOpen = true)">
        Settings
      </PlBtnGhost>
    </template>
    <div style="flex: 1">
      <PlAgDataTable
        ref="tableInstance"
        v-model="app.model.ui.perSampleTable.tableState"
        :settings="tableSettings"
        show-columns-panel
        @columns-changed="(info) => (columns = info.columns)"
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
  <AnnotationsModal />
</template>
