import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';
import { createApp } from 'vue';
import App from './App.vue';

// Define custom elements
defineCustomElements();

createApp(App).mount('#app');
