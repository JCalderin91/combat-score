import { ref, watch } from 'vue';
import { gameConfig } from '../config/gameConfig';

export function useFouls(onPointAwarded: (player: 'A' | 'B') => void) {
  const foulsA = ref(0);
  const foulsB = ref(0);

  // Vigilar cuando las faltas alcanzan el límite para otorgar puntos
  watch(foulsA, (newFouls) => {
    if (newFouls > 0 && newFouls % gameConfig.foulsForPoint === 0) {
      onPointAwarded('B'); // El jugador B recibe un punto
    }
  });

  watch(foulsB, (newFouls) => {
    if (newFouls > 0 && newFouls % gameConfig.foulsForPoint === 0) {
      onPointAwarded('A'); // El jugador A recibe un punto
    }
  });

  const addFoulA = () => {
    foulsA.value++;
  };

  const removeFoulA = () => {
    if (foulsA.value > 0) {
      foulsA.value--;
    }
  };

  const addFoulB = () => {
    foulsB.value++;
  };

  const removeFoulB = () => {
    if (foulsB.value > 0) {
      foulsB.value--;
    }
  };

  const reset = () => {
    foulsA.value = 0;
    foulsB.value = 0;
  };

  return {
    foulsA,
    foulsB,
    addFoulA,
    removeFoulA,
    addFoulB,
    removeFoulB,
    reset,
  };
}

