// Utilidad para trackear eventos en Amplitude

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      setUserId: (userId: string) => void;
      setUserProperties: (userProperties: Record<string, any>) => void;
    };
  }
}

/**
 * Verifica si Amplitude está disponible
 */
function isAmplitudeAvailable(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.amplitude !== 'undefined' && 
         typeof window.amplitude.track === 'function';
}

/**
 * Trackea un evento en Amplitude si está disponible
 */
export function trackEvent(eventName: string, eventProperties?: Record<string, any>) {
  try {
    if (isAmplitudeAvailable()) {
      window.amplitude!.track(eventName, eventProperties);
      console.log('[Analytics] Event tracked:', eventName, eventProperties);
    } else {
      // Si Amplitude no está disponible, intentar de nuevo después de un pequeño delay
      // Esto puede ayudar si el script aún se está cargando
      setTimeout(() => {
        if (isAmplitudeAvailable()) {
          window.amplitude!.track(eventName, eventProperties);
          console.log('[Analytics] Event tracked (delayed):', eventName, eventProperties);
        } else {
          console.warn('[Analytics] Amplitude not available for event:', eventName);
        }
      }, 100);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

/**
 * Eventos del juego
 */
export const GameEvents = {
  // Timer
  GAME_STARTED: 'game_started',
  GAME_STOPPED: 'game_stopped',
  GAME_RESET: 'game_reset',
  GAME_FINISHED: 'game_finished',
  
  // Puntos
  POINTS_ADDED: 'points_added',
  POINTS_REMOVED: 'points_removed',
  
  // Faltas
  FOUL_ADDED: 'foul_added',
  FOUL_REMOVED: 'foul_removed',
  
  // Salidas
  EXIT_ADDED: 'exit_added',
  EXIT_REMOVED: 'exit_removed',
  
  // Configuración
  CONFIG_CHANGED: 'config_changed',
  
  // UI
  TIMELINE_OPENED: 'timeline_opened',
  CONFIG_OPENED: 'config_opened',
  FULLSCREEN_TOGGLED: 'fullscreen_toggled',
} as const;

