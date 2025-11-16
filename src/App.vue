<script setup lang="ts">
import { useGame } from './composables/useGame';
import Timer from './components/Timer.vue';
import PlayerScore from './components/PlayerScore.vue';
import PlayerControls from './components/PlayerControls.vue';
import PlayerStats from './components/PlayerStats.vue';

const game = useGame();
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4 md:p-8">
    
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
