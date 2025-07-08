<script setup lang="ts">
import { getRawPlatformaInstance } from '@platforma-sdk/model';
import { PlBtnGhost } from '@platforma-sdk/ui-vue';
import { ref } from 'vue';
import { useApp } from '../app';

const app = useApp();
const exporting = ref(false);

async function exportTsv() {
  exporting.value = true;
  try {
    const handle = app.model.outputs.exportedTsvZip?.handle;
    if (handle !== undefined) {
      const pl = getRawPlatformaInstance();
      const contentArray = await pl.blobDriver.getContent(handle);
      const contentBlob = new Blob([contentArray], { type: 'application/zip' });
      const url = URL.createObjectURL(contentBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clones.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <PlBtnGhost
    :icon="app.model.outputs.exportedTsvZip === null ? 'close' : 'download'"
    :disabled="app.model.outputs.exportedTsvZip === null"
    :loading="exporting || (app.model.outputs.exportedTsvZip?.handle === undefined && app.model.outputs.exportedTsvZip !== null)"
    @click.stop="exportTsv"
  >
    Export All
  </PlBtnGhost>
</template>
