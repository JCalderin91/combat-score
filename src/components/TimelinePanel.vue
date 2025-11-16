<script setup lang="ts">
import { useTimeline } from '../composables/useTimeline';

const { events, isOpen, closeTimeline, formatTime } = useTimeline();

const getEventColor = (player: 'A' | 'B') => {
    return player === 'A' ? 'text-red-600' : 'text-blue-600';
};

const getEventBgColor = (player: 'A' | 'B') => {
  return player === 'A' ? 'bg-red-50' : 'bg-blue-50';
};
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-30 z-40"
      @click="closeTimeline"
    ></div>
  </Transition>

  <!-- Panel lateral -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-r border-gray-200"
      @click.stop
    >
      <div class="p-4 sm:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Historial del Combate</h2>
          <button
            @click="closeTimeline"
            class="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Timeline -->
        <div v-if="events.length === 0" class="text-center py-12 text-gray-500">
          <p class="text-lg">No hay eventos aún</p>
          <p class="text-sm mt-2">Los eventos aparecerán aquí cuando ocurran</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="event in events"
            :key="event.id"
            class="flex items-center justify-between gap-3 py-1 px-2 rounded-lg border border-gray-200"
            :class="getEventBgColor(event.player)"
          >
            <span 
              class="font-semibold text-sm"
              :class="getEventColor(event.player)"
            >
              {{ event.description }}
            </span>
            <span class="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 flex-shrink-0">
              {{ formatTime(event.time) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>

