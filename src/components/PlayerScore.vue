<script setup lang="ts">
interface Props {
  score: number;
  playerName: string;
  color: 'red' | 'blue';
}

defineProps<Props>();

const colorClasses = {
  red: {
    bg: 'bg-red-500',
    border: 'border-red-600'
  },
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-600'
  }
};
</script>

<template>
  <div 
    class="rounded-xl sm:rounded-2xl landscape:rounded-lg shadow-2xl p-2 sm:p-6 md:p-8 landscape:p-2 border-2 sm:border-4 landscape:border-2"
    :class="[colorClasses[color].bg, colorClasses[color].border]">
    <div class="text-6xl sm:text-7xl md:text-9xl landscape:text-5xl font-bold text-white text-center font-mono">
      {{ score }}
    </div>
  </div>
</template>

