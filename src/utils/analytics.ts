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

const USER_ID_STORAGE_KEY = 'combat-score-user-id';

/**
 * Genera o obtiene un ID único de usuario
 * Si el usuario ya tiene un ID guardado en localStorage, lo usa
 * Si no, genera uno nuevo y lo guarda
 */
function getOrCreateUserId(): string {
  try {
    let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
    
    if (!userId) {
      // Generar un ID único usando timestamp + random + user agent hash
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const userAgentHash = navigator.userAgent
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        .toString(36)
        .substring(0, 8);
      
      userId = `user_${timestamp}_${random}_${userAgentHash}`;
      localStorage.setItem(USER_ID_STORAGE_KEY, userId);
    }
    
    return userId;
  } catch (error) {
    console.error('[Analytics] Error getting/creating user ID:', error);
    // Fallback: generar un ID temporal sin localStorage
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

/**
 * Identifica al usuario en Amplitude
 * Debe llamarse después de que Amplitude esté inicializado
 */
export function identifyUser() {
  try {
    if (isAmplitudeAvailable()) {
      const userId = getOrCreateUserId();
      window.amplitude!.setUserId(userId);
      
      // Agregar propiedades del usuario
      const userProperties = {
        language: navigator.language || 'unknown',
        platform: navigator.platform || 'unknown',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
        firstSeen: localStorage.getItem(`${USER_ID_STORAGE_KEY}_first_seen`) || new Date().toISOString(),
      };
      
      // Guardar fecha de primera visita si no existe
      if (!localStorage.getItem(`${USER_ID_STORAGE_KEY}_first_seen`)) {
        localStorage.setItem(`${USER_ID_STORAGE_KEY}_first_seen`, userProperties.firstSeen);
      }
      
      window.amplitude!.setUserProperties(userProperties);
      console.log('[Analytics] User identified:', userId);
    } else {
      // Si Amplitude no está disponible, intentar de nuevo después de un delay
      setTimeout(() => {
        if (isAmplitudeAvailable()) {
          identifyUser();
        }
      }, 500);
    }
  } catch (error) {
    console.error('[Analytics] Error identifying user:', error);
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

