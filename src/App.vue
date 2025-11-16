<script setup lang="ts">
import { useGame } from './composables/useGame';
import { useConfig } from './composables/useConfig';
import { useFullscreen } from './composables/useFullscreen';
import Timer from './components/Timer.vue';
import PlayerScore from './components/PlayerScore.vue';
import PlayerControls from './components/PlayerControls.vue';
import PlayerStats from './components/PlayerStats.vue';
import ConfigPanel from './components/ConfigPanel.vue';

const game = useGame();
const { openConfig } = useConfig();
const { isFullscreen, toggleFullscreen } = useFullscreen();
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-2 sm:p-4 md:p-8 relative">
    
    <!-- Botones flotantes superiores -->
    <div class="fixed top-2 right-2 sm:top-3 sm:right-3 z-30 flex gap-2">
      <!-- Botón de pantalla completa -->
      <button
        @click="toggleFullscreen"
        class="bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-gray-800 p-1.5 sm:p-2 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 backdrop-blur-sm border border-gray-200"
        :aria-label="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
      >
        <!-- Icono de expandir (cuando NO está en pantalla completa) -->
        <svg v-if="!isFullscreen" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <!-- Icono de comprimir (cuando SÍ está en pantalla completa) -->
        <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      </button>

      <!-- Botón flotante de configuración -->
      <button
        @click="openConfig"
        class="bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-gray-800 p-1.5 sm:p-2 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 backdrop-blur-sm border border-gray-200"
        aria-label="Configuración"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>

    <!-- Panel de configuración -->
    <ConfigPanel />
    
    <!-- Layout Portrait (vertical) -->
    <div class="max-w-6xl mx-auto space-y-3 sm:space-y-6 md:space-y-8 landscape:hidden">
      
      <!-- Timer Component -->
      <Timer 
        :formatted-minutes="game.formattedMinutes.value"
        :formatted-seconds="game.formattedSeconds.value"
        :is-running="game.isRunning.value"
        :time-remaining="game.timeRemaining.value"
        :is-finished="game.gameStatus.value.isFinished"
        :winner="game.gameStatus.value.winner"
        :reason="game.gameStatus.value.reason"
        @start="game.startGame()"
        @stop="game.stopGame()"
        @reset="game.resetGame()"
      />
      
      <!-- Points Display -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <PlayerScore 
          :score="game.scoreA.value"
          player-name="Jugador A"
          color="red"
        />
        <PlayerScore 
          :score="game.scoreB.value"
          player-name="Jugador B"
          color="blue"
        />
      </div>
      
      <!-- Score Controls -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <PlayerControls 
          player-name="A"
          color="red"
          @add-points="game.addPointsA"
        />
        <PlayerControls 
          player-name="B"
          color="blue"
          :reverse="true"
          @add-points="game.addPointsB"
        />
      </div>
      
      <!-- Fouls -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <PlayerStats 
          :count="game.foulsA.value"
          label="Faltas"
          player-name="A"
          color="yellow"
          @add="game.addFoulA()"
          @remove="game.removeFoulA()"
        />
        <PlayerStats 
          :count="game.foulsB.value"
          label="Faltas"
          player-name="B"
          color="orange"
          :reverse="true"
          @add="game.addFoulB()"
          @remove="game.removeFoulB()"
        />
      </div>
      
      <!-- Exits -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <PlayerStats 
          :count="game.exitsA.value"
          :warnings="game.warningsA.value"
          label="Salidas"
          player-name="A"
          color="cyan"
          @add="game.addExitA()"
          @remove="game.removeExitA()"
        />
        <PlayerStats 
          :count="game.exitsB.value"
          :warnings="game.warningsB.value"
          label="Salidas"
          player-name="B"
          color="teal"
          :reverse="true"
          @add="game.addExitB()"
          @remove="game.removeExitB()"
        />
      </div>
      
    </div>

    <!-- Layout Landscape (horizontal) - 3 columnas -->
    <div class="hidden landscape:grid landscape:grid-cols-3 gap-2 h-screen max-h-screen overflow-hidden">
      
      <!-- Columna 1: Jugador A -->
      <div class="flex flex-col gap-2 py-2 pl-2 overflow-y-auto">
        <PlayerControls 
          player-name="A"
          color="red"
          @add-points="game.addPointsA"
        />
        <PlayerStats 
          :count="game.foulsA.value"
          label="Faltas"
          player-name="A"
          color="yellow"
          @add="game.addFoulA()"
          @remove="game.removeFoulA()"
        />
        <PlayerStats 
          :count="game.exitsA.value"
          :warnings="game.warningsA.value"
          label="Salidas"
          player-name="A"
          color="cyan"
          @add="game.addExitA()"
          @remove="game.removeExitA()"
        />
      </div>

      <!-- Columna 2: Timer y Scores -->
      <div class="flex flex-col gap-2 py-2 justify-center items-center">
        <Timer 
          :formatted-minutes="game.formattedMinutes.value"
          :formatted-seconds="game.formattedSeconds.value"
          :is-running="game.isRunning.value"
          :time-remaining="game.timeRemaining.value"
          :is-finished="game.gameStatus.value.isFinished"
          :winner="game.gameStatus.value.winner"
          :reason="game.gameStatus.value.reason"
          @start="game.startGame()"
          @stop="game.stopGame()"
          @reset="game.resetGame()"
        />
        <div class="w-full grid grid-cols-2 gap-2">
          <PlayerScore 
            :score="game.scoreA.value"
            player-name="Jugador A"
            color="red"
          />
          <PlayerScore 
            :score="game.scoreB.value"
            player-name="Jugador B"
            color="blue"
          />
        </div>
      </div>

      <!-- Columna 3: Jugador B -->
      <div class="flex flex-col gap-2 py-2 pr-2 overflow-y-auto">
        <PlayerControls 
          player-name="B"
          color="blue"
          :reverse="true"
          @add-points="game.addPointsB"
        />
        <PlayerStats 
          :count="game.foulsB.value"
          label="Faltas"
          player-name="B"
          color="orange"
          :reverse="true"
          @add="game.addFoulB()"
          @remove="game.removeFoulB()"
        />
        <PlayerStats 
          :count="game.exitsB.value"
          :warnings="game.warningsB.value"
          label="Salidas"
          player-name="B"
          color="teal"
          :reverse="true"
          @add="game.addExitB()"
          @remove="game.removeExitB()"
        />
      </div>

    </div>
  </div>
</template>
