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
  data() {
    return {
      isPhaseMenuOpen: false,
    }
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
  <div class="controls" @click="isPhaseMenuOpen = false">
    <div class="controls__phases-menu" title="Lista de Fases">
      <mdicon class="controls__phases-menu__control" :name="isPhaseMenuOpen ? 'close' : 'menu'" @click.stop="isPhaseMenuOpen = !isPhaseMenuOpen"></mdicon>
      <div v-if="isPhaseMenuOpen" class="controls__phases-selector" @click.stop>
        <div class="controls__phases-selector__phase" v-for="(phase, index) in gameStore.phases" :key="index" @click="gameStore.changePhase(index)">
          <span>{{ phase.name }}</span>
          <div class="controls__phases-selector__phase__marks">
            <mdicon v-if="phase.isFinished" name="check"></mdicon>
            <mdicon v-if="phase.isMinMoves" name="medal"></mdicon>
          </div>
        </div>
      </div>
    </div>
    <div class="controls__script">
      <div class="controls__script__buttons">
        <div class="controls__script__button" v-for="(move, index) in gameStore.moves" :key="index">
          <ControlButton :moveType="move.type" :moveState="move.state" @click="remove(index)"/>
          <input class="controls__script__button__input" min="1" v-if="move.type === MoveType.LOOP_START" v-model="move.repeat" :disabled="!gameStore.isBuilding" type="number"/>
        </div>
      </div>
      <mdicon class="controls__script__medal" size="30px" title="Melhor Script" name="medal" v-if="gameStore.isSuccess && gameStore.currentPhase.isMinMoves"/>
    </div>
    <div class="controls__play">
      <mdicon size="50px" title="Iniciar Script" name="play" v-if="gameStore.isBuilding" @click="gameStore.play"/>
      <mdicon size="50px" title="Reiniciar Fase" name="restart" v-if="gameStore.isFinished" @click="gameStore.build"/>
      <mdicon size="50px" title="Próximo Nível" name="skip-next" v-if="gameStore.isSuccess" @click="gameStore.changePhase()"/>
    </div>
    <div class="controls__buttons">
      <div class="controls__buttons__loop">
        <ControlButton :moveType="MoveType.LOOP_START" @click="add(MoveType.LOOP_START)" disabled></ControlButton>
        <ControlButton :moveType="MoveType.LOOP_END" @click="add(MoveType.LOOP_END)"></ControlButton>
      </div>
      <div class="controls__buttons__arrows">
        <ControlButton size="80px" :moveType="MoveType.UP" @click="add(MoveType.UP)"></ControlButton>
        <div style="width: 100%; height: 0px"></div>
        <ControlButton :moveType="MoveType.LEFT" @click="add(MoveType.LEFT)"></ControlButton>
        <ControlButton :moveType="MoveType.DOWN" @click="add(MoveType.DOWN)"></ControlButton>
        <ControlButton :moveType="MoveType.RIGHT" @click="add(MoveType.RIGHT)"></ControlButton>
      </div>
      <ControlButton :moveType="MoveType.OPEN" @click="add(MoveType.OPEN)"></ControlButton>
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

.controls__phases-menu {
  position: absolute;
  top: 10px;
  right: 10px;
  text-align: right;
  background: var(--color-background);
  z-index: 1;
}

.controls__phases-menu__control {
  cursor: pointer;
}

.controls__phases-selector {
  user-select: none;
  border: 2px solid var(--color-border);
  margin-left: 10px;
  padding: 5px;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.controls__phases-selector__phase {
  text-align: center;
  cursor: pointer;
  width: 90px;
  padding: 10px;
  border: 3px solid var(--color-border);
}

.controls__phases-selector__phase__marks {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls__script {
  position: relative;
  border: 5px solid var(--color-border);
  width: 100%;
  height: 40%;
  overflow: auto;
}

.controls__script__buttons {
  display: flex;
  flex-wrap: wrap;
  margin: 3%;
}

.controls__script__medal {
  position: absolute;
  top: 0;
  left: calc(50% - 15px);
}

.controls__script__button {
  position: relative;
  height: 80px;
}

.controls__script__button__input {
  position: absolute;
  top: 30px;
  left: 11px;
  width: 40px;
  height: 20px;
}

.controls__play {
  height: 50px;
}

.controls__play span {
  cursor: pointer;
}

.controls__buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.controls__buttons__loop {
  display: flex;
  flex-direction: column;
}

.controls__buttons__arrows {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.controls__script__buttons span, .controls__buttons span {
  display: contents;
  cursor: pointer;
}
</style>
