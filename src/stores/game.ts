import { defineStore } from 'pinia';

import { GameState } from '@/consts/game_state';

export const useGameStore = defineStore({
  id: 'game',
  state: () => ({
    state: GameState.LOADING,
  }),
  getters: {
    state: (state) => state.state,
  },
  actions: {
    setState(state: GameState) {
      this.state = state;
    },
  },
});
