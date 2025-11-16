import { computed, watch } from 'vue';
import { useTimer } from './useTimer';
import { useScore } from './useScore';
import { useFouls } from './useFouls';
import { useExits } from './useExits';

export function useGame() {
  const timer = useTimer();
  const score = useScore();
  
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

  // Detener el juego automáticamente si hay ganador
  watch(() => gameStatus.value.isFinished, (isFinished) => {
    if (isFinished) {
      timer.stop();
    }
  });

  const resetGame = () => {
    timer.reset();
    score.reset();
    fouls.reset();
    exits.reset();
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
    // Game status
    gameStatus,
    // Actions
    startGame,
    stopGame,
    resetGame,
  };
}

