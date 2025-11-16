<script setup lang="ts">
import { ref, watch } from 'vue';
import { useConfig } from '../composables/useConfig';
import type { GameConfig } from '../config/gameConfig';

const { gameConfig, isOpen, closeConfig, updateConfig, resetToDefault, defaultConfig } = useConfig();

// Formulario local
const formData = ref<GameConfig>({
  pointsToWin: gameConfig.pointsToWin,
  foulsForPoint: gameConfig.foulsForPoint,
  exitsForWarning: gameConfig.exitsForWarning,
  maxTimeInSeconds: gameConfig.maxTimeInSeconds,
});

// Sincronizar formulario cuando se abre el panel
watch(isOpen, (open) => {
  if (open) {
    formData.value = {
      pointsToWin: gameConfig.pointsToWin,
      foulsForPoint: gameConfig.foulsForPoint,
      exitsForWarning: gameConfig.exitsForWarning,
      maxTimeInSeconds: gameConfig.maxTimeInSeconds,
    };
  }
});

const handleSubmit = () => {
  // Validar valores mínimos
  if (formData.value.pointsToWin < 1) formData.value.pointsToWin = 1;
  if (formData.value.foulsForPoint < 1) formData.value.foulsForPoint = 1;
  if (formData.value.exitsForWarning < 1) formData.value.exitsForWarning = 1;
  if (formData.value.maxTimeInSeconds < 1) formData.value.maxTimeInSeconds = 1;

  updateConfig(formData.value);
  closeConfig();
};

const handleReset = () => {
  formData.value = { ...defaultConfig };
  resetToDefault();
};

const handleClose = () => {
  closeConfig();
};
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-30 z-40"
      @click="handleClose"
    ></div>
  </Transition>

  <!-- Panel lateral -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200"
      @click.stop
    >
      <div class="p-4 sm:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Configuración</h2>
          <button
            @click="handleClose"
            class="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Puntos para ganar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Puntos para ganar
            </label>
            <input
              v-model.number="formData.pointsToWin"
              type="number"
              min="1"
              class="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <!-- Faltas para punto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Faltas para otorgar punto al oponente
            </label>
            <input
              v-model.number="formData.foulsForPoint"
              type="number"
              min="1"
              class="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <p class="mt-1 text-xs text-gray-600">
              Cada {{ formData.foulsForPoint }} falta(s) otorga 1 punto al oponente
            </p>
          </div>

          <!-- Salidas para amonestación -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Salidas para amonestación
            </label>
            <input
              v-model.number="formData.exitsForWarning"
              type="number"
              min="1"
              class="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <p class="mt-1 text-xs text-gray-600">
              Cada {{ formData.exitsForWarning }} salida(s) otorga 1 falta
            </p>
          </div>

          <!-- Tiempo máximo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tiempo máximo (segundos)
            </label>
            <input
              v-model.number="formData.maxTimeInSeconds"
              type="number"
              min="1"
              class="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <p class="mt-1 text-xs text-gray-600">
              {{ Math.floor(formData.maxTimeInSeconds / 60) }} minuto(s) y {{ formData.maxTimeInSeconds % 60 }} segundo(s)
            </p>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="handleReset"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Restaurar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
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
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>

