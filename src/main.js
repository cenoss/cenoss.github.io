import { createApp } from 'vue';
import App from './App.vue';
import { applyDocumentLocale } from './i18n.js';
import './styles/revamp.css';

applyDocumentLocale();
createApp(App).mount('#app');
