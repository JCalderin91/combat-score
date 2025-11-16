import { ref, computed } from 'vue';
import { gameConfig } from '../config/gameConfig';

export function useTimer() {
  const timeRemaining = ref(gameConfig.maxTimeInSeconds);
  const isRunning = ref(false);
  let intervalId: number | null = null;

  const minutes = computed(() => {
    return Math.floor(timeRemaining.value / 60);
  });

  const seconds = computed(() => {
    return timeRemaining.value % 60;
  });

  const formattedMinutes = computed(() => {
    return minutes.value.toString().padStart(2, '0');
  });

  const formattedSeconds = computed(() => {
    return seconds.value.toString().padStart(2, '0');
  });

  const isTimeUp = computed(() => {
    return timeRemaining.value <= 0;
  });

  const timeElapsed = computed(() => {
    return gameConfig.maxTimeInSeconds - timeRemaining.value;
  });

  const start = () => {
    if (isRunning.value || isTimeUp.value) return;
    
    isRunning.value = true;
    intervalId = window.setInterval(() => {
      timeRemaining.value--;
      
      if (isTimeUp.value) {
        stop();
      }
    }, 1000);
  };

  const stop = () => {
    if (!isRunning.value) return;
    
    isRunning.value = false;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const reset = () => {
    stop();
    timeRemaining.value = gameConfig.maxTimeInSeconds;
  };

  return {
    timeRemaining,
    timeElapsed,
    isRunning,
    minutes,
    seconds,
    formattedMinutes,
    formattedSeconds,
    isTimeUp,
    start,
    stop,
    reset,
  };
}

