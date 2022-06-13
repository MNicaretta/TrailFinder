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
  methods: {
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
    <div class="controls__phases-menu">
      <mdicon class="controls__phases-menu__control" title="Lista de Fases" :name="isPhaseMenuOpen ? 'close' : 'menu'" @click.stop="isPhaseMenuOpen = !isPhaseMenuOpen"></mdicon>
      <div v-if="isPhaseMenuOpen" class="controls__phases-selector" @click.stop>
        <div class="controls__phases-selector__phase"
             v-for="(phase, index) in gameStore.phases"
             :title="phase.name"
             :key="index"
             @click="gameStore.changePhase(index)">
          <img :src="phase.thumbnail" />
          <div class="controls__phases-selector__phase__marks">
            <mdicon v-if="phase.isFinished" size="100%" name="check"></mdicon>
            <mdicon v-if="phase.isMinMoves" size="100%" name="medal"></mdicon>
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
      <mdicon size="100%" title="Iniciar Script" name="play" v-if="gameStore.isBuilding" @click="gameStore.play"/>
      <mdicon size="100%" title="Reiniciar Fase" name="restart" v-if="gameStore.isFinished" @click="gameStore.build"/>
      <mdicon size="100%" title="Próximo Nível" name="skip-next" v-if="gameStore.isSuccess" @click="gameStore.changePhase()"/>
    </div>
    <div class="controls__buttons">
      <div class="controls__buttons__loop">
        <ControlButton :moveType="MoveType.LOOP_START" @click="add(MoveType.LOOP_START)" disabled></ControlButton>
        <ControlButton :moveType="MoveType.LOOP_END" @click="add(MoveType.LOOP_END)"></ControlButton>
      </div>
      <div class="controls__buttons__arrows">
        <ControlButton :moveType="MoveType.UP" @click="add(MoveType.UP)"></ControlButton>
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
  min-height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 20px;

  padding: 30px;
}

.controls__phases-menu {
  position: absolute;
  top: 5px;
  right: 5px;
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
  margin-left: 5px;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  max-height: calc((var(--controls-width) - 65px));
  overflow: auto;
}

.controls__phases-selector__phase {
  width: calc((var(--controls-width) - 90px) / 4);
  height: calc((var(--controls-width) - 90px) / 4);
  cursor: pointer;
  background-color: #5d988d;
}

.controls__phases-selector__phase img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.controls__phases-selector__phase__marks {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1;
}

.controls__script {
  position: relative;
  border: 5px solid var(--color-border);
  width: 100%;
  height: calc(var(--base-button-size) * 3 + 30px);
  overflow: auto;
}

.controls__script__buttons {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
}

.controls__script__medal {
  position: absolute;
  top: 0;
  left: calc(50% - 15px);
}

.controls__script__button {
  cursor: pointer;
  width: var(--base-button-size);
  height: var(--base-button-size);
}

.controls__script__button__input {
  position: absolute;
  top: 35%;
  left: 20%;
  width: 60%;
  height: 30%;
  font-size: calc(var(--base-button-size) * 0.2);
}

.controls__play {
  width: 100%;
  display: flex;
  justify-content: center;
  height: var(--base-button-size);
}

.controls__play .mdi {
  cursor: pointer;
}

.controls__buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.controls__buttons .mdi {
  cursor: pointer;
  width: var(--base-button-size);
  height: var(--base-button-size);
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
</style>
