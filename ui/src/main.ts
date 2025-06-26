import '@platforma-sdk/ui-vue/styles';
import { createApp } from 'vue';
import { sdkPlugin } from './app';
import { BlockLayout } from '@platforma-sdk/ui-vue';

console.log('Clonotype Browser 2 UI is running!');

createApp(BlockLayout).use(sdkPlugin).mount('#app');
