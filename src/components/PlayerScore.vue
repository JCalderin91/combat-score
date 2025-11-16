<script setup lang="ts">
interface Props {
  score: number;
  playerName: string;
  color: 'red' | 'blue';
}

defineProps<Props>();

const colorClasses = {
  red: {
    bg: 'bg-red-900',
    border: 'border-red-600'
  },
  blue: {
    bg: 'bg-blue-900',
    border: 'border-blue-600'
  }
};
</script>

<template>
  <div 
    class="rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-6 md:p-8 border-2 sm:border-4"
    :class="[colorClasses[color].bg, colorClasses[color].border]">
    <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-2 sm:mb-4">
      {{ playerName }}
    </h2>
    <div class="text-6xl sm:text-7xl md:text-9xl font-bold text-white text-center font-mono">
      {{ score }}
    </div>
  </div>
</template>

