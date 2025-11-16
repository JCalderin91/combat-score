import { ref, computed } from 'vue';
import { gameConfig } from '../config/gameConfig';

export function useScore() {
  const scoreA = ref(0);
  const scoreB = ref(0);

  const hasWinner = computed(() => {
    return scoreA.value >= gameConfig.pointsToWin || scoreB.value >= gameConfig.pointsToWin;
  });

  const winner = computed(() => {
    if (scoreA.value >= gameConfig.pointsToWin) return 'A';
    if (scoreB.value >= gameConfig.pointsToWin) return 'B';
    return null;
  });

  const addPointsA = (points: number) => {
    scoreA.value = Math.max(0, scoreA.value + points);
  };

  const addPointsB = (points: number) => {
    scoreB.value = Math.max(0, scoreB.value + points);
  };

  const reset = () => {
    scoreA.value = 0;
    scoreB.value = 0;
  };

  return {
    scoreA,
    scoreB,
    hasWinner,
    winner,
    addPointsA,
    addPointsB,
    reset,
  };
}

