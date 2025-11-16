import { computed, watch } from 'vue';
import { useTimer } from './useTimer';
import { useScore } from './useScore';
import { useFouls } from './useFouls';
import { useExits } from './useExits';
import { useTimeline } from './useTimeline';
import { playWhistleSound } from '../utils/sounds';

export function useGame() {
  const timer = useTimer();
  const score = useScore();
  const timeline = useTimeline();
  let hasPlayedSound = false; // Evitar reproducir múltiples veces
  
  // Callback para cuando se otorga un punto por faltas
  const handleFoulPoint = (player: 'A' | 'B') => {
    if (player === 'A') {
      score.addPointsA(1);
    } else {
      score.addPointsB(1);
    }
  };

  const fouls = useFouls(handleFoulPoint);
  
  // Callback para cuando se alcanza el máximo de salidas (3 salidas = 1 falta)
  const handleMaxExitsReached = (player: 'A' | 'B') => {
    if (player === 'A') {
      fouls.addFoulA();
    } else {
      fouls.addFoulB();
    }
  };

  const exits = useExits(handleMaxExitsReached);

  // Estado del juego
  const gameStatus = computed(() => {
    if (score.hasWinner.value) {
      return {
        isFinished: true,
        winner: score.winner.value,
        reason: 'points',
      };
    }

    if (timer.isTimeUp.value) {
      // Determinar ganador por desempate
      if (score.scoreA.value !== score.scoreB.value) {
        return {
          isFinished: true,
          winner: score.scoreA.value > score.scoreB.value ? 'A' : 'B',
          reason: 'time',
        };
      }

      // En caso de empate, pierde quien tenga más faltas y salidas
      const totalInfractionsA = fouls.foulsA.value + exits.exitsA.value;
      const totalInfractionsB = fouls.foulsB.value + exits.exitsB.value;

      if (totalInfractionsA !== totalInfractionsB) {
        return {
          isFinished: true,
          winner: totalInfractionsA < totalInfractionsB ? 'A' : 'B',
          reason: 'infractions',
        };
      }

      // Empate perfecto
      return {
        isFinished: true,
        winner: null,
        reason: 'draw',
      };
    }

    return {
      isFinished: false,
      winner: null,
      reason: null,
    };
  });

  // Detener el juego automáticamente si hay ganador y reproducir sonido
  watch(() => gameStatus.value.isFinished, (isFinished) => {
    if (isFinished) {
      timer.stop();
      // Reproducir sonido de silbato cuando el juego termina (ganador o tiempo finalizado)
      if (!hasPlayedSound) {
        hasPlayedSound = true;
        playWhistleSound();
      }
    }
  });

  // Capturar eventos de puntos
  watch(() => score.scoreA.value, (newScore, oldScore) => {
    if (oldScore !== undefined && newScore > oldScore && timer.isRunning.value) {
      const pointsAdded = newScore - oldScore;
      timeline.addEvent('point', 'A', pointsAdded, timer.timeElapsed.value);
    }
  });

  watch(() => score.scoreB.value, (newScore, oldScore) => {
    if (oldScore !== undefined && newScore > oldScore && timer.isRunning.value) {
      const pointsAdded = newScore - oldScore;
      timeline.addEvent('point', 'B', pointsAdded, timer.timeElapsed.value);
    }
  });

  // Capturar eventos de faltas
  watch(() => fouls.foulsA.value, (newFouls, oldFouls) => {
    if (oldFouls !== undefined && newFouls > oldFouls && timer.isRunning.value) {
      const foulsAdded = newFouls - oldFouls;
      timeline.addEvent('foul', 'A', foulsAdded, timer.timeElapsed.value);
    }
  });

  watch(() => fouls.foulsB.value, (newFouls, oldFouls) => {
    if (oldFouls !== undefined && newFouls > oldFouls && timer.isRunning.value) {
      const foulsAdded = newFouls - oldFouls;
      timeline.addEvent('foul', 'B', foulsAdded, timer.timeElapsed.value);
    }
  });

  // Capturar eventos de salidas
  watch(() => exits.exitsA.value, (newExits, oldExits) => {
    if (oldExits !== undefined && newExits > oldExits && timer.isRunning.value) {
      const exitsAdded = newExits - oldExits;
      timeline.addEvent('exit', 'A', exitsAdded, timer.timeElapsed.value);
    }
  });

  watch(() => exits.exitsB.value, (newExits, oldExits) => {
    if (oldExits !== undefined && newExits > oldExits && timer.isRunning.value) {
      const exitsAdded = newExits - oldExits;
      timeline.addEvent('exit', 'B', exitsAdded, timer.timeElapsed.value);
    }
  });

  const resetGame = () => {
    timer.reset();
    score.reset();
    fouls.reset();
    exits.reset();
    timeline.reset(); // Resetear el timeline
    hasPlayedSound = false; // Resetear el flag al resetear el juego
  };

  const startGame = () => {
    if (!gameStatus.value.isFinished) {
      timer.start();
    }
  };

  const stopGame = () => {
    timer.stop();
  };

  return {
    // Timer - usar spread directo
    ...timer,
    // Score
    ...score,
    // Fouls
    ...fouls,
    // Exits
    ...exits,
    // Timeline
    timeline,
    // Game status
    gameStatus,
    // Actions
    startGame,
    stopGame,
    resetGame,
  };
}

