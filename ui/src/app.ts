import { defineApp, annotationModelController } from '@platforma-sdk/ui-vue';
import AnnotationStatsPage from './AnnotationStatsPage.vue';
import { ref, computed } from 'vue';
import PerSamplePage from './PerSamplePage.vue';
import OverlapPage from './OverlapPage.vue';
import type { Platforma, SimplifiedUniversalPColumnEntry } from '@platforma-open/milaboratories.clonotype-browser-2.model';

export const sdkPlugin = defineApp(platforma as Platforma, (app) => {
  const isAnnotationModalOpen = ref(false);

  const filterColumns = computed((): SimplifiedUniversalPColumnEntry[] => {
    if (app.model.args.annotationScript.mode === 'bySampleAndClonotype') {
      const { bySampleAndClonotypeColumns, byClonotypeColumns } = app.model.outputs;

      if (!bySampleAndClonotypeColumns || !byClonotypeColumns) {
        return [];
      }

      return [...bySampleAndClonotypeColumns, ...byClonotypeColumns];
    }

    return app.model.outputs.byClonotypeColumns ?? [];
  });

  annotationModelController(
    () => app.model.args.annotationScript,
    () => app.model.ui.annotationScript,
  );

  return {
    isAnnotationModalOpen,
    filterColumns,
    routes: {
      '/': () => PerSamplePage,
      '/overlap': () => OverlapPage,
      '/stats': () => AnnotationStatsPage,
    },
  };
}, { debug: true });

export const useApp = sdkPlugin.useApp;
