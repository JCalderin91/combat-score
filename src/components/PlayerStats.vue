<script setup lang="ts">
interface Props {
  count: number;
  label: string;
  playerName: string;
  color: 'yellow' | 'orange' | 'cyan' | 'teal';
  warnings?: number;
  reverse?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  add: [];
  remove: [];
}>();

const colorClasses = {
  yellow: {
    border: 'border-yellow-600',
    label: 'text-yellow-400',
    btnLight: 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700',
    btnDark: 'bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-800'
  },
  orange: {
    border: 'border-orange-600',
    label: 'text-orange-400',
    btnLight: 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700',
    btnDark: 'bg-orange-700 hover:bg-orange-600 active:bg-orange-800'
  },
  cyan: {
    border: 'border-cyan-600',
    label: 'text-cyan-400',
    btnLight: 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700',
    btnDark: 'bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800'
  },
  teal: {
    border: 'border-teal-600',
    label: 'text-teal-400',
    btnLight: 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700',
    btnDark: 'bg-teal-700 hover:bg-teal-600 active:bg-teal-800'
  }
};
</script>

<template>
  <div 
    class="bg-gray-800 rounded-lg sm:rounded-xl shadow-xl p-3 sm:p-4 md:p-6 border"
    :class="colorClasses[color].border">
    <div class="flex items-center justify-between gap-2 sm:gap-4">
      <button 
        @click="emit('add')"
        class="text-white text-base sm:text-lg font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 rounded-lg shadow-lg active:scale-95 transition-all"
        :class="colorClasses[color].btnLight"
        :style="reverse ? 'order: 3' : 'order: 1'">
        +1
      </button>
      <div class="text-center flex-1" :style="'order: 2'">
        <div 
          class="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider mb-0.5 sm:mb-1"
          :class="colorClasses[color].label">
          {{ label }} {{ playerName }}
        </div>
        <div class="text-white text-2xl sm:text-3xl font-bold font-mono">{{ count }}</div>
      </div>
      <button 
        @click="emit('remove')"
        class="text-white text-base sm:text-lg font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 rounded-lg shadow-lg active:scale-95 transition-all"
        :class=" colorClasses[color].btnDark"
        :style="reverse ? 'order: 1' : 'order: 3'">
        -1
      </button>
    </div>
  </div>
</template>

