<script setup lang="ts">
interface Props {
  playerName: string;
  color: 'red' | 'blue';
  reverse?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  addPoints: [points: number];
}>();

const colorClasses = {
  red: {
    border: 'border-red-600',
    title: 'text-red-400',
    btnLight: 'bg-red-600 hover:bg-red-500 active:bg-red-700',
    btnDark: 'bg-red-700 hover:bg-red-600 active:bg-red-800'
  },
  blue: {
    border: 'border-blue-600',
    title: 'text-blue-400',
    btnLight: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700',
    btnDark: 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800'
  }
};
</script>

<template>
  <div 
    class="bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border"
    :class="colorClasses[color].border">
    <h3 
      class="text-sm sm:text-base md:text-xl font-bold text-center mb-2 sm:mb-3 md:mb-4"
      :class="colorClasses[color].title">
      Controles {{ playerName }}
    </h3>
    <div class="space-y-2 sm:space-y-3">
      <div class="flex gap-2 sm:gap-3">
        <button 
          @click="emit('addPoints', 1)"
          class="flex-1 text-white text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 rounded-lg shadow-lg active:scale-95 transition-all"
          :class="colorClasses[color].btnDark"
          :style="reverse ? 'order: 2' : 'order: 1'">
          +1
        </button>
        <button 
          @click="emit('addPoints', -1)"
          class="flex-1 text-white text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 rounded-lg shadow-lg active:scale-95 transition-all"
          :class="colorClasses[color].btnLight"
          :style="reverse ? 'order: 1' : 'order: 2'">
          -1
        </button>
      </div>
      <div class="flex gap-2 sm:gap-3">
        <button 
          @click="emit('addPoints', 2)"
          class="flex-1 text-white text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 rounded-lg shadow-lg active:scale-95 transition-all"
          :class="colorClasses[color].btnDark"
          :style="reverse ? 'order: 2' : 'order: 1'">
          +2
        </button>
        <button 
          @click="emit('addPoints', -2)"
          class="flex-1 text-white text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 rounded-lg shadow-lg active:scale-95 transition-all"
          :class="colorClasses[color].btnLight"
          :style="reverse ? 'order: 1' : 'order: 2'">
          -2
        </button>
      </div>
      <div class="flex gap-2 sm:gap-3">
        <button 
          @click="emit('addPoints', 3)"
          class="flex-1 text-white text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 rounded-lg shadow-lg active:scale-95 transition-all"
          :class="colorClasses[color].btnDark"
          :style="reverse ? 'order: 2' : 'order: 1'">
          +3
        </button>
        <button 
          @click="emit('addPoints', -3)"
          class="flex-1 text-white text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 rounded-lg shadow-lg active:scale-95 transition-all"
          :class="colorClasses[color].btnLight"
          :style="reverse ? 'order: 1' : 'order: 2'">
          -3
        </button>
      </div>
    </div>
  </div>
</template>

