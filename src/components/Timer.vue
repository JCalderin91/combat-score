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
  if (props.isRunning && props.timeRemaining <= 10) return 'red';
  if (props.isRunning && props.timeRemaining > 10) return 'green';
  if (!props.isRunning && props.timeRemaining < 90) return 'yellow';
  return 'gray';
});

const statusIcon = computed(() => {
  if (props.isRunning && props.timeRemaining <= 10) return '⚠️ 10s';
  if (props.isRunning) return '▶';
  if (props.timeRemaining < 90) return '⏸';
  return '●';
});
</script>

<template>
  <div class="bg-gray-800 rounded-lg sm:rounded-xl shadow-xl p-2 sm:p-3 border border-gray-700">
    <div class="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-wide">
      <span 
        class="px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors duration-300"
        :class="{
          'bg-red-700 text-white': getStatusColor === 'red',
          'bg-green-700 text-white': getStatusColor === 'green',
          'bg-yellow-600 text-white': getStatusColor === 'yellow',
          'bg-gray-700 text-white': getStatusColor === 'gray'
        }">
        {{ formattedMinutes }}
      </span>
      <span 
        class="px-1 transition-colors duration-300"
        :class="{
          'text-red-400': getStatusColor === 'red',
          'text-green-400': getStatusColor === 'green',
          'text-yellow-400': getStatusColor === 'yellow',
          'text-gray-400': getStatusColor === 'gray'
        }">:</span>
      <span 
        class="px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors duration-300"
        :class="{
          'bg-red-700 text-white': getStatusColor === 'red',
          'bg-green-700 text-white': getStatusColor === 'green',
          'bg-yellow-600 text-white': getStatusColor === 'yellow',
          'bg-gray-700 text-white': getStatusColor === 'gray'
        }">
        {{ formattedSeconds }}
      </span>
      
      <!-- Estado del cronómetro - inline -->
      <span 
        class="inline-flex items-center ml-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold transition-colors duration-300"
        :class="{
          'bg-red-600 text-white': getStatusColor === 'red',
          'bg-green-600 text-white': getStatusColor === 'green',
          'bg-yellow-600 text-white': getStatusColor === 'yellow',
          'bg-gray-600 text-white': getStatusColor === 'gray'
        }">
        <span 
          class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-1"
          :class="isRunning ? 'bg-white animate-pulse' : 'bg-white'"></span>
        {{ statusIcon }}
      </span>
    </div>
   
    <!-- Timer Control Buttons -->
    <div class="flex justify-center items-center gap-2 mt-2 sm:mt-2.5">
      <button 
        @click="handleToggleTimer" 
        :disabled="isFinished"
        class="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-lg active:scale-95 transition-all duration-200 min-w-[80px] sm:min-w-[90px] text-xs sm:text-sm">
        {{ isRunning ? 'Pause' : 'Start' }}
      </button>
      <button 
        @click="emit('reset')"
        class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-lg active:scale-95 transition-all duration-200 text-xs sm:text-sm">
        Reset
      </button>
    </div>

    <!-- Game Status Messages -->
    <div v-if="isFinished" class="mt-2 text-center">
      <div class="bg-yellow-500 text-gray-900 font-bold text-sm sm:text-base py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg inline-block">
        <span v-if="winner">
          ¡Jugador {{ winner }} GANA!
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

