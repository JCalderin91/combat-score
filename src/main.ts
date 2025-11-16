import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { trackEvent, identifyUser } from './utils/analytics'

// Exponer identifyUser globalmente para que pueda ser llamado desde index.html
if (typeof window !== 'undefined') {
  (window as any).identifyUser = identifyUser;
}

const app = createApp(App)
app.mount('#app')

// Identificar usuario y trackear carga inicial de la aplicación
// Esperar un poco para asegurar que Amplitude esté cargado
setTimeout(() => {
  identifyUser();
  trackEvent('app_loaded', {
    timestamp: new Date().toISOString(),
  });
}, 500);
