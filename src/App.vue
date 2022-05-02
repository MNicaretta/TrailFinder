<script setup lang="ts">
import { GameState } from '@/consts/game_state';
import { useGameStore } from '@/stores/game';

import Tutorial from "./components/Tutorial.vue";
import Controls from './components/Controls.vue';

const gameStore = useGameStore();

</script>

<template>
  <main>
    <Tutorial v-if="gameStore.isLoading"></Tutorial>
    <Controls v-else></Controls>
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  margin: 0;
  padding: 0;

  font-weight: normal;
}

main {
  width: 100%;
  height: 100%;
}
</style>
