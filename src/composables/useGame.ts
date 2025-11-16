import { computed, watch } from 'vue';
import { useTimer } from './useTimer';
import { useScore } from './useScore';
import { useFouls } from './useFouls';
import { useExits } from './useExits';
import { useTimeline } from './useTimeline';
import { playWhistleSound } from '../utils/sounds';
import { trackEvent, GameEvents } from '../utils/analytics';

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
  
  // Callback para cuando se alcanza el máximo de salidas (3 salidas = 1 punto al oponente)
  const handleMaxExitsReached = (player: 'A' | 'B') => {
    // Otorgar punto al oponente
    if (player === 'A') {
      // Peleador A tiene 3 salidas, otorgar punto a B
      score.addPointsB(1);
    } else {
      // Peleador B tiene 3 salidas, otorgar punto a A
      score.addPointsA(1);
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
  watch(() => gameStatus.value.isFinished, (isFinished, oldIsFinished) => {
    if (isFinished && !oldIsFinished) {
      timer.stop();
      // Reproducir sonido de silbato cuando el juego termina (ganador o tiempo finalizado)
      if (!hasPlayedSound) {
        hasPlayedSound = true;
        playWhistleSound();
        // Trackear fin del juego
        trackEvent(GameEvents.GAME_FINISHED, {
          winner: gameStatus.value.winner,
          reason: gameStatus.value.reason,
          scoreA: score.scoreA.value,
          scoreB: score.scoreB.value,
          foulsA: fouls.foulsA.value,
          foulsB: fouls.foulsB.value,
          exitsA: exits.exitsA.value,
          exitsB: exits.exitsB.value,
          timeElapsed: timer.timeElapsed.value,
        });
      }
    }
  });

  // Capturar eventos de puntos (tanto sumas como restas)
  watch(() => score.scoreA.value, (newScore, oldScore) => {
    if (oldScore !== undefined && newScore !== oldScore && timer.isRunning.value) {
      const pointsChanged = newScore - oldScore;
      timeline.addEvent('point', 'A', pointsChanged, timer.timeElapsed.value);
      // Trackear en Amplitude
      trackEvent(pointsChanged > 0 ? GameEvents.POINTS_ADDED : GameEvents.POINTS_REMOVED, {
        player: 'A',
        points: Math.abs(pointsChanged),
        newScore,
        oldScore,
        timeElapsed: timer.timeElapsed.value,
      });
    }
  });

  watch(() => score.scoreB.value, (newScore, oldScore) => {
    if (oldScore !== undefined && newScore !== oldScore && timer.isRunning.value) {
      const pointsChanged = newScore - oldScore;
      timeline.addEvent('point', 'B', pointsChanged, timer.timeElapsed.value);
      // Trackear en Amplitude
      trackEvent(pointsChanged > 0 ? GameEvents.POINTS_ADDED : GameEvents.POINTS_REMOVED, {
        player: 'B',
        points: Math.abs(pointsChanged),
        newScore,
        oldScore,
        timeElapsed: timer.timeElapsed.value,
      });
    }
  });

  // Capturar eventos de faltas
  watch(() => fouls.foulsA.value, (newFouls, oldFouls) => {
    if (oldFouls !== undefined && newFouls !== oldFouls && timer.isRunning.value) {
      const foulsChanged = newFouls - oldFouls;
      timeline.addEvent('foul', 'A', foulsChanged, timer.timeElapsed.value);
      // Trackear en Amplitude
      trackEvent(foulsChanged > 0 ? GameEvents.FOUL_ADDED : GameEvents.FOUL_REMOVED, {
        player: 'A',
        fouls: Math.abs(foulsChanged),
        newFouls,
        oldFouls,
        timeElapsed: timer.timeElapsed.value,
      });
    }
  });

  watch(() => fouls.foulsB.value, (newFouls, oldFouls) => {
    if (oldFouls !== undefined && newFouls !== oldFouls && timer.isRunning.value) {
      const foulsChanged = newFouls - oldFouls;
      timeline.addEvent('foul', 'B', foulsChanged, timer.timeElapsed.value);
      // Trackear en Amplitude
      trackEvent(foulsChanged > 0 ? GameEvents.FOUL_ADDED : GameEvents.FOUL_REMOVED, {
        player: 'B',
        fouls: Math.abs(foulsChanged),
        newFouls,
        oldFouls,
        timeElapsed: timer.timeElapsed.value,
      });
    }
  });

  // Capturar eventos de salidas
  watch(() => exits.exitsA.value, (newExits, oldExits) => {
    if (oldExits !== undefined && newExits !== oldExits && timer.isRunning.value) {
      const exitsChanged = newExits - oldExits;
      timeline.addEvent('exit', 'A', exitsChanged, timer.timeElapsed.value);
      // Trackear en Amplitude
      trackEvent(exitsChanged > 0 ? GameEvents.EXIT_ADDED : GameEvents.EXIT_REMOVED, {
        player: 'A',
        exits: Math.abs(exitsChanged),
        newExits,
        oldExits,
        timeElapsed: timer.timeElapsed.value,
      });
    }
  });

  watch(() => exits.exitsB.value, (newExits, oldExits) => {
    if (oldExits !== undefined && newExits !== oldExits && timer.isRunning.value) {
      const exitsChanged = newExits - oldExits;
      timeline.addEvent('exit', 'B', exitsChanged, timer.timeElapsed.value);
      // Trackear en Amplitude
      trackEvent(exitsChanged > 0 ? GameEvents.EXIT_ADDED : GameEvents.EXIT_REMOVED, {
        player: 'B',
        exits: Math.abs(exitsChanged),
        newExits,
        oldExits,
        timeElapsed: timer.timeElapsed.value,
      });
    }
  });

  const resetGame = () => {
    timer.reset();
    score.reset();
    fouls.reset();
    exits.reset();
    timeline.reset(); // Resetear el timeline
    hasPlayedSound = false; // Resetear el flag al resetear el juego
    // Trackear reset
    trackEvent(GameEvents.GAME_RESET);
  };

  const startGame = () => {
    if (!gameStatus.value.isFinished) {
      timer.start();
      // Trackear inicio del juego
      trackEvent(GameEvents.GAME_STARTED, {
        maxTime: timer.timeRemaining.value,
      });
    }
  };

  const stopGame = () => {
    timer.stop();
    // Trackear pausa del juego
    trackEvent(GameEvents.GAME_STOPPED, {
      timeElapsed: timer.timeElapsed.value,
      timeRemaining: timer.timeRemaining.value,
    });
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

