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
    border: 'border-yellow-500',
    label: 'text-yellow-600',
    btnLight: 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600',
    btnDark: 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700'
  },
  orange: {
    border: 'border-orange-500',
    label: 'text-orange-600',
    btnLight: 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600',
    btnDark: 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700'
  },
  cyan: {
    border: 'border-cyan-500',
    label: 'text-cyan-600',
    btnLight: 'bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600',
    btnDark: 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700'
  },
  teal: {
    border: 'border-teal-500',
    label: 'text-teal-600',
    btnLight: 'bg-teal-500 hover:bg-teal-400 active:bg-teal-600',
    btnDark: 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700'
  }
};
</script>

<template>
  <div 
    class="bg-white rounded-lg sm:rounded-xl landscape:rounded shadow-xl p-2 sm:p-4 md:p-6 landscape:p-2 border-2"
    :class="colorClasses[color].border">
    <div class="flex items-center justify-between gap-2 sm:gap-4 landscape:gap-1">
      <button 
        @click="emit('add')"
        class="text-white text-base sm:text-lg landscape:text-sm font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 landscape:px-2 landscape:py-1.5 rounded-lg landscape:rounded shadow-lg active:scale-95 transition-all"
        :class="colorClasses[color].btnLight"
        :style="reverse ? 'order: 3' : 'order: 1'">
        +1
      </button>
      <div class="text-center flex-1" :style="'order: 2'">
        <div 
          class="text-[10px] sm:text-xs md:text-sm landscape:text-[8px] font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 landscape:mb-0"
          :class="colorClasses[color].label">
          {{ label }} {{ playerName }}
        </div>
        <div class="text-gray-900 text-2xl sm:text-3xl landscape:text-xl font-bold font-mono text-slate-800">{{ count }}</div>
      </div>
      <button 
        @click="emit('remove')"
        class="text-white text-base sm:text-lg landscape:text-sm font-bold px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 landscape:px-2 landscape:py-1.5 rounded-lg landscape:rounded shadow-lg active:scale-95 transition-all"
        :class=" colorClasses[color].btnDark"
        :style="reverse ? 'order: 1' : 'order: 3'">
        -1
      </button>
    </div>
  </div>
</template>

