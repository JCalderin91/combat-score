import { ref, computed, watch } from 'vue';
import { gameConfig } from '../config/gameConfig';

export function useExits(onMaxExitsReached: (player: 'A' | 'B') => void) {
  const exitsA = ref(0);
  const exitsB = ref(0);
  const lastFoulExitsA = ref(0); // Última vez que se otorgó falta por salidas
  const lastFoulExitsB = ref(0);

  const warningsA = computed(() => {
    return Math.floor(exitsA.value / gameConfig.exitsForWarning);
  });

  const warningsB = computed(() => {
    return Math.floor(exitsB.value / gameConfig.exitsForWarning);
  });

  // Vigilar cuando se alcanza el máximo de salidas
  watch(exitsA, (newExits) => {
    // Verificar si se alcanzó un nuevo múltiplo de 3
    if (newExits >= gameConfig.exitsForWarning && 
        Math.floor(newExits / gameConfig.exitsForWarning) > Math.floor(lastFoulExitsA.value / gameConfig.exitsForWarning)) {
      onMaxExitsReached('A');
      lastFoulExitsA.value = newExits; // Actualizar el último registro
    }
  });

  watch(exitsB, (newExits) => {
    // Verificar si se alcanzó un nuevo múltiplo de 3
    if (newExits >= gameConfig.exitsForWarning && 
        Math.floor(newExits / gameConfig.exitsForWarning) > Math.floor(lastFoulExitsB.value / gameConfig.exitsForWarning)) {
      onMaxExitsReached('B');
      lastFoulExitsB.value = newExits; // Actualizar el último registro
    }
  });

  const addExitA = () => {
    exitsA.value++;
  };

  const removeExitA = () => {
    if (exitsA.value > 0) {
      exitsA.value--;
    }
  };

  const addExitB = () => {
    exitsB.value++;
  };

  const removeExitB = () => {
    if (exitsB.value > 0) {
      exitsB.value--;
    }
  };

  const reset = () => {
    exitsA.value = 0;
    exitsB.value = 0;
    lastFoulExitsA.value = 0;
    lastFoulExitsB.value = 0;
  };

  return {
    exitsA,
    exitsB,
    warningsA,
    warningsB,
    addExitA,
    removeExitA,
    addExitB,
    removeExitB,
    reset,
  };
}

