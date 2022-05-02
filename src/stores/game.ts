import { defineStore } from 'pinia';

import { GameState } from '@/consts/game_state';

export const useGameStore = defineStore({
  id: 'game',
  state: () => ({
    state: GameState.LOADING,
    moves: [] as Move[],
  }),
  getters: {
    isLoading: (state) => state.state == GameState.LOADING,
    isBuilding: (state) => state.state === GameState.BUILDING,
    isPlaying: (state) => state.state === GameState.PLAYING,
    nextMove: (state) => state.moves[0],
  },
  actions: {
    play() {
      this.state = GameState.PLAYING;
    },
    build() {
      this.state = GameState.BUILDING;
    },
    setMoves(moves: Move[]) {
      if (moves) {
        this.moves = moves;
      }
    },
    shiftMove() {
      this.moves.shift();
    },
  },
});
