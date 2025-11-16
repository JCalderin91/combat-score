import { ref, reactive, watch } from 'vue';
import type { GameConfig } from '../config/gameConfig';

const STORAGE_KEY = 'combat-score-config';

const defaultConfig: GameConfig = {
  pointsToWin: 7,
  foulsForPoint: 2,
  exitsForWarning: 3,
  maxTimeInSeconds: 90,
};

function loadConfigFromStorage(): GameConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validar que tenga todas las propiedades necesarias
      if (
        typeof parsed.pointsToWin === 'number' &&
        typeof parsed.foulsForPoint === 'number' &&
        typeof parsed.exitsForWarning === 'number' &&
        typeof parsed.maxTimeInSeconds === 'number'
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading config from localStorage:', error);
  }
  return { ...defaultConfig };
}

function saveConfigToStorage(config: GameConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config to localStorage:', error);
  }
}

// Configuración reactiva
export const gameConfig = reactive<GameConfig>(loadConfigFromStorage());

// Estado compartido del panel de configuración
export const isConfigOpen = ref(false);

// Guardar automáticamente cuando cambie la configuración
watch(
  () => ({ ...gameConfig }),
  (newConfig) => {
    saveConfigToStorage(newConfig);
  },
  { deep: true }
);

export function useConfig() {
  const openConfig = () => {
    isConfigOpen.value = true;
  };

  const closeConfig = () => {
    isConfigOpen.value = false;
  };

  const updateConfig = (newConfig: Partial<GameConfig>) => {
    Object.assign(gameConfig, newConfig);
  };

  const resetToDefault = () => {
    Object.assign(gameConfig, defaultConfig);
  };

  return {
    gameConfig,
    isOpen: isConfigOpen,
    openConfig,
    closeConfig,
    updateConfig,
    resetToDefault,
    defaultConfig,
  };
}

