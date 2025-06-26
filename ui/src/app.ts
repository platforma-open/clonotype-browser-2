import { defineApp } from '@platforma-sdk/ui-vue';
import AnnotationStatsPage from './AnnotationStatsPage.vue';
import { ref, computed } from 'vue';
import PerSamplePage from './PerSamplePage.vue';
import OverlapPage from './OverlapPage.vue';
import type { Platforma, SimplifiedUniversalPColumnEntry } from '@platforma-open/milaboratories.clonotype-browser-2.model';

export const sdkPlugin = defineApp(platforma as Platforma, (_app) => {
  const isAnnotationModalOpen = ref(false);

  const filterColumns = computed((): undefined | SimplifiedUniversalPColumnEntry[] => {
    if (_app.model.args.annotationScript.mode === 'bySampleAndClonotype') {
      const { bySampleAndClonotypeColumns, byClonotypeColumns } = _app.model.outputs;

      if (!bySampleAndClonotypeColumns || !byClonotypeColumns) {
        return undefined;
      }

      return [...bySampleAndClonotypeColumns, ...byClonotypeColumns];
    }

    return _app.model.outputs.byClonotypeColumns ?? [];
  });

  const filterColumnsOptions = computed(() => filterColumns.value?.map((c) => ({ label: c.label, value: c.id })));

  return {
    isAnnotationModalOpen,
    filterColumns,
    filterColumnsOptions,
    routes: {
      '/': () => PerSamplePage,
      '/overlap': () => OverlapPage,
      '/stats': () => AnnotationStatsPage,
    },
  };
}, { debug: true });

export const useApp = sdkPlugin.useApp;
