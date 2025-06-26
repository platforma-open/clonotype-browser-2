import { defineConfig } from 'vite';
import { createViteDevConfig } from '@milaboratories/build-configs';

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  return createViteDevConfig(configEnv);
});
