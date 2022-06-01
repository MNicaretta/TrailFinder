<script lang="ts">
import { defineComponent } from 'vue'

import ControlButton from './ControlButton.vue';

import { useGameStore } from '@/stores/game';
import { MoveType } from '@/models/move';

export default defineComponent({
  setup() {
    const gameStore = useGameStore();

    return { gameStore, MoveType };
  },
  components: {
    ControlButton
  },
  beforeMount () {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  computed: {
    playButtonText(): string {
      if (this.gameStore.isBuilding) {
        return 'START';
      }

      if (this.gameStore.isPlaying) {
        return 'RESTART';
      }

      return '';
    }
  },
  methods: {
    handleKeydown(e: KeyboardEvent) {
      switch(e.key) {
        case "ArrowUp":
          this.add(MoveType.UP);
          break;

        case "ArrowLeft":
          this.add(MoveType.LEFT);
          break;

        case "ArrowDown":
          this.add(MoveType.DOWN);
          break;

        case "ArrowRight":
          this.add(MoveType.RIGHT);
          break;

        case "Backspace":
          this.remove();
          break;

        case "Enter":
          this.gameStore.play();
          break;
      }
    },

    add(moveType: MoveType) {
      this.gameStore.addMove(moveType);
    },

    remove(index?: number) {
      this.gameStore.removeMove(index);
    },
  }
})
</script>

<template>
  <div class="controls">
    <div class="controls__script">
      <ControlButton v-for="(move, index) in gameStore.moves"
              :key="index"
              :moveType="move.type"
              :moveState="move.state"
              @click="remove(index)"/>
    </div>
    <div class="controls__play">
      <mdicon size="50px" name="play" v-if="gameStore.isBuilding" @click="gameStore.play"/>
      <mdicon size="50px" name="restart" v-if="gameStore.isFinished" @click="gameStore.build"/>
      <mdicon size="50px" name="skip-next" v-if="gameStore.isSuccess" @click="gameStore.nextPhase"/>
    </div>
    <div class="controls__buttons">
      <ControlButton :moveType="MoveType.OPEN" @click="add(MoveType.OPEN)"></ControlButton>
      <ControlButton :moveType="MoveType.UP" @click="add(MoveType.UP)"></ControlButton>
      <ControlButton :moveType="MoveType.OPEN" @click="add(MoveType.OPEN)"></ControlButton>
      <div style="width: 100%; height: 0px"></div>
      <ControlButton :moveType="MoveType.LEFT" @click="add(MoveType.LEFT)"></ControlButton>
      <ControlButton :moveType="MoveType.DOWN" @click="add(MoveType.DOWN)"></ControlButton>
      <ControlButton :moveType="MoveType.RIGHT" @click="add(MoveType.RIGHT)"></ControlButton>
    </div>
  </div>
</template>

<style scoped>
.controls {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  padding: 7%;
}

.controls__script {
  border: 5px solid var(--color-border);

  width: 100%;
  height: 40%;

  padding: 3%;

  overflow: auto;
}

.controls__play {
  height: 50px;
}

.controls__play span {
  cursor: pointer;
}

.controls__buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.controls__script span, .controls__buttons span {
  display: contents;
  cursor: pointer;
}
</style>
