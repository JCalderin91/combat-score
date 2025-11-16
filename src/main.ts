import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { trackEvent } from './utils/analytics'

const app = createApp(App)
app.mount('#app')

// Trackear carga inicial de la aplicación
// Esperar un poco para asegurar que Amplitude esté cargado
setTimeout(() => {
  trackEvent('app_loaded', {
    timestamp: new Date().toISOString(),
  });
}, 500);
