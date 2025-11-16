<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  formattedMinutes: string;
  formattedSeconds: string;
  isRunning: boolean;
  timeRemaining: number;
  isFinished: boolean;
  winner: string | null;
  reason: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  start: [];
  stop: [];
  reset: [];
}>();

const handleToggleTimer = () => {
  if (props.isRunning) {
    emit('stop');
  } else {
    emit('start');
  }
};

const getStatusColor = computed(() => {
  // Si hay ganador, usar el color del ganador
  if (props.isFinished && props.winner === 'A') return 'winner-red';
  if (props.isFinished && props.winner === 'B') return 'winner-blue';
  if (props.isRunning && props.timeRemaining <= 10) return 'red';
  if (props.isRunning && props.timeRemaining > 10) return 'green';
  if (!props.isRunning && props.timeRemaining < 90) return 'yellow';
  return 'gray';
});

const getContainerColor = computed(() => {
  // Resaltar el contenedor con el color del ganador
  if (props.isFinished && props.winner === 'A') {
    return 'bg-red-500 border-red-600 shadow-red-500/50';
  }
  if (props.isFinished && props.winner === 'B') {
    return 'bg-blue-500 border-blue-600 shadow-blue-500/50';
  }
  return 'bg-white border-gray-300';
});

const statusIcon = computed(() => {
  if (props.isRunning && props.timeRemaining <= 10) return '⚠️ 10s';
  if (props.isRunning) return '▶';
  if (props.timeRemaining < 90) return '⏸';
  return '●';
});
</script>

<template>
  <div 
    class="rounded-lg sm:rounded-xl landscape:rounded shadow-xl p-2 sm:p-3 landscape:p-2 border-2 transition-all duration-500"
    :class="getContainerColor">
    <div class="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl landscape:text-2xl font-bold font-mono tracking-wide">
      <span 
        class="px-2 py-1 sm:px-3 sm:py-1.5 landscape:px-2 landscape:py-0.5 rounded-md transition-colors duration-300"
        :class="{
          'bg-red-600 text-white': getStatusColor === 'red',
          'bg-green-300 text-black': getStatusColor === 'green',
          'bg-yellow-300 text-black': getStatusColor === 'yellow',
          'bg-gray-200 text-black': getStatusColor === 'gray',
          'bg-red-700 text-white': getStatusColor === 'winner-red',
          'bg-blue-700 text-white': getStatusColor === 'winner-blue'
        }">
        {{ formattedMinutes }}
      </span>
      <span 
        class="px-1 transition-colors duration-300"
        :class="{
          'text-red-400': getStatusColor === 'red',
          'text-green-400': getStatusColor === 'green',
          'text-yellow-400': getStatusColor === 'yellow',
          'text-gray-400': getStatusColor === 'gray',
          'text-red-200': getStatusColor === 'winner-red',
          'text-blue-200': getStatusColor === 'winner-blue'
        }">:</span>
      <span 
        class="px-2 py-1 sm:px-3 sm:py-1.5 landscape:px-2 landscape:py-0.5 rounded-md transition-colors duration-300"
        :class="{
          'bg-red-600 text-white': getStatusColor === 'red',
          'bg-green-300 text-black': getStatusColor === 'green',
          'bg-yellow-300 text-black': getStatusColor === 'yellow',
          'bg-gray-200 text-black': getStatusColor === 'gray',
          'bg-red-700 text-white': getStatusColor === 'winner-red',
          'bg-blue-700 text-white': getStatusColor === 'winner-blue'
        }">
        {{ formattedSeconds }}
      </span>
      
      <!-- Estado del cronómetro - inline -->
      <span 
        class="inline-flex items-center ml-3 landscape:ml-2 px-2 py-0.5 sm:px-2.5 sm:py-1 landscape:px-1.5 landscape:py-0.5 rounded-full text-[9px] sm:text-[10px] landscape:text-[8px] font-semibold transition-colors duration-300"
        :class="{
          'bg-red-600 text-white': getStatusColor === 'red',
          'bg-green-300 text-black': getStatusColor === 'green',
          'bg-yellow-300 text-black': getStatusColor === 'yellow',
          'bg-gray-200 text-black': getStatusColor === 'gray',
          'bg-red-700 text-white': getStatusColor === 'winner-red',
          'bg-blue-700 text-white': getStatusColor === 'winner-blue'
        }">
        <span 
          class="w-1 h-1 sm:w-1.5 sm:h-1.5 landscape:w-1 landscape:h-1 rounded-full mr-1"
          :class="isRunning ? 'bg-white animate-pulse' : 'bg-white'"></span>
        {{ statusIcon }}
      </span>
    </div>
   
    <!-- Timer Control Buttons -->
    <div class="flex justify-center items-center gap-2 landscape:gap-1 mt-2 sm:mt-2.5 landscape:mt-1.5">
      <button 
        @click="handleToggleTimer" 
        :disabled="isFinished"
        class="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 landscape:px-3 landscape:py-1.5 rounded-lg landscape:rounded shadow-lg active:scale-95 transition-all duration-200 min-w-[80px] sm:min-w-[90px] landscape:min-w-[60px] text-xs sm:text-sm landscape:text-xs">
        {{ isRunning ? 'Pause' : 'Play' }}
      </button>
      <button 
        @click="emit('reset')"
        class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 landscape:px-3 landscape:py-1.5 rounded-lg landscape:rounded shadow-lg active:scale-95 transition-all duration-200 text-xs sm:text-sm landscape:text-xs">
        Reiniciar
      </button>
    </div>

    <!-- Game Status Messages -->
    <div v-if="isFinished" class="mt-2 landscape:mt-1 text-center">
      <div 
        class="font-bold text-sm sm:text-base landscape:text-xs py-1.5 px-3 sm:py-2 sm:px-4 landscape:py-1 landscape:px-2 rounded-lg landscape:rounded inline-block shadow-md transition-all duration-500"
        :class="{
          'bg-red-600 text-white': winner === 'A',
          'bg-blue-600 text-white': winner === 'B',
          'bg-yellow-400 text-gray-900': !winner
        }">
        <span v-if="winner">
          ¡Peleador {{ winner }} GANA!
          <span class="hidden sm:inline" v-if="reason === 'points'"> (Puntos)</span>
          <span class="hidden sm:inline" v-else-if="reason === 'time'"> (Tiempo)</span>
          <span class="hidden sm:inline" v-else-if="reason === 'infractions'"> (Infracciones)</span>
        </span>
        <span v-else>
          ¡EMPATE!
        </span>
      </div>
    </div>
  </div>
</template>

