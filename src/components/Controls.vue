<script lang="ts">
import { defineComponent } from 'vue'

import { DefaultMoves } from '@/consts/default_moves'
import { GameState } from '@/consts/game_state';

import { useGameStore } from '@/stores/game';

export default defineComponent({
  setup() {
    const gameStore = useGameStore();

    return { DefaultMoves, gameStore };
  },

  data() {
    return {
      moves: [] as DefaultMoves[],
    }
  },
  beforeMount () {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  computed: {
    playButtonClasses(): any {
      return {
        'controls__play--playing': this.gameStore.isPlaying,
      };
    },

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
          this.add(DefaultMoves.UP);
          break;

        case "ArrowLeft":
          this.add(DefaultMoves.LEFT);
          break;

        case "ArrowDown":
          this.add(DefaultMoves.DOWN);
          break;

        case "ArrowRight":
          this.add(DefaultMoves.RIGHT);
          break;

        case "Backspace":
          this.remove();
          break;

        case "Enter":
          this.play();
          break;
      }
    },

    add(move: DefaultMoves) {
      if (this.gameStore.isBuilding) {
        this.moves.push(move);
      }
    },

    remove(index?: number) {
      if (this.gameStore.isBuilding) {
        this.moves.splice(index ?? this.moves.length - 1, 1);
      }
    },

    getIconName(move: DefaultMoves) {
      switch (move) {
        case DefaultMoves.UP:
          return "arrow-up-bold";

        case DefaultMoves.DOWN:
          return "arrow-down-bold";

        case DefaultMoves.LEFT:
          return "arrow-left-bold";

        case DefaultMoves.RIGHT:
          return "arrow-right-bold";
      }
    },

    togglePlay() {
      if (this.gameStore.isBuilding) {
        this.play()
      } else if (this.gameStore.isPlaying) {
        this.stop();
      }
    },

    play() {
      if (this.gameStore.isBuilding) {
        this.gameStore.setMoves(this.moves.map(move => {
          switch (move) {
            case DefaultMoves.UP:
              return {
                x: 0,
                y: -1,
              };

            case DefaultMoves.DOWN:
              return {
                x: 0,
                y: 1,
              };

            case DefaultMoves.LEFT:
              return {
                x: -1,
                y: 0,
              };

            case DefaultMoves.RIGHT:
              return {
                x: 1,
                y: 0,
              };
          }
        }));
        this.gameStore.play();
      }
    },

    stop() {
      this.gameStore.build();
    },
  }
})
</script>

<template>
  <div class="controls">
    <div class="controls__script">
      <mdicon v-for="(move, index) in moves"
              :key="index" size="80px"
              :name="getIconName(move)"
              @click="remove(index)"/>
    </div>
    <div class="controls__play" :class="playButtonClasses" @click="togglePlay">{{ playButtonText }}</div>
    <div class="controls__buttons">
      <mdicon size="80px" :name="getIconName(DefaultMoves.UP)" @click="add(DefaultMoves.UP)"/>
      <div style="width: 100%; height: 0px"></div>
      <mdicon size="80px" :name="getIconName(DefaultMoves.LEFT)" @click="add(DefaultMoves.LEFT)"/>
      <mdicon size="80px" :name="getIconName(DefaultMoves.DOWN)" @click="add(DefaultMoves.DOWN)"/>
      <mdicon size="80px" :name="getIconName(DefaultMoves.RIGHT)" @click="add(DefaultMoves.RIGHT)"/>
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
  padding: 5px 15px;

  font-size: 30px;
  text-align: center;

  cursor: pointer;
  user-select: none;
}

.controls__play, .controls__play--success {
  background-color: green;
}

.controls__play--playing, .controls__play--failed {
  background-color: red;
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
