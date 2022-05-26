import { defineStore } from 'pinia';

import { Move, MoveState, type MoveType } from '@/models/move';
import { GameResult, GameState } from '@/consts/game';

export const useGameStore = defineStore({
  id: 'game',
  state: () => ({
    _state: GameState.LOADING,
    _result: GameResult.UNDEFINED,
    _moves: [] as Move[],
    _moveIndex: 0,
  }),
  getters: {
    isLoading: (state) => state._state == GameState.LOADING,
    isBuilding: (state) => state._state === GameState.BUILDING,
    isPlaying: (state) => state._state === GameState.PLAYING,
    isFinished: (state) => state._state === GameState.FINISHED,
    isSuccess: (state) =>
      state._state === GameState.FINISHED &&
      state._result === GameResult.SUCCESS,
    currentMove: (state) => state._moves[state._moveIndex],
    moves: (state) => state._moves,
  },
  actions: {
    play() {
      if (this.isBuilding) {
        this._moveIndex = 0;
        this._state = GameState.PLAYING;
        this._result = GameResult.UNDEFINED;
      }
    },
    build() {
      this._state = GameState.BUILDING;
      this._moves.forEach((move) => move.reset());
    },
    finishLevel(result = GameResult.UNDEFINED) {
      this._state = GameState.FINISHED;
      this._result = result;
    },
    addMove(moveType: MoveType) {
      if (this.isBuilding) {
        this._moves.push(new Move(moveType));
      }
    },
    removeMove(index?: number) {
      if (this.isBuilding) {
        this._moves.splice(index ?? this._moves.length - 1, 1);
      }
    },
    classifyMove(state: MoveState) {
      this.currentMove.state = state;
      this._moveIndex++;
    },
  },
});
