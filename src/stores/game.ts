import { defineStore } from 'pinia';

import { Move, MoveState, type MoveType } from '@/models/move';
import { GameChars, GamePhases, GameResult, GameState } from '@/consts/game';

export const useGameStore = defineStore({
  id: 'game',
  state: () => ({
    _char: 1,
    _state: GameState.LOADING,
    _result: GameResult.UNDEFINED,
    _phases: GamePhases,
    _phaseIndex: 0,
    _loaded: false,
    _moves: [] as Move[],
    _moveIndex: 0,
  }),
  getters: {
    currentChar: (state) => GameChars[state._char],
    nextChar: (state) => GameChars[(state._char + 1) % GameChars.length],
    isLoading: (state) => state._state == GameState.LOADING,
    isBuilding: (state) => state._state === GameState.BUILDING,
    isPlaying: (state) => state._state === GameState.PLAYING,
    isFinished: (state) => state._state === GameState.FINISHED,
    isSuccess: (state) =>
      state._state === GameState.FINISHED &&
      state._result === GameResult.SUCCESS,
    currentPhase: (state) => state._phases[state._phaseIndex],
    isLoaded: (state) => state._loaded,
    currentMove: (state) => state._moves[state._moveIndex],
    moves: (state) => state._moves,
  },
  actions: {
    changeChar() {
      this._char = (this._char + 1) % GameChars.length;
    },
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
    finishPhase(result = GameResult.UNDEFINED) {
      this._state = GameState.FINISHED;
      this._result = result;
    },
    nextPhase() {
      this._state = GameState.BUILDING;
      this._loaded = false;
      this._moves = [];
      this._phaseIndex++;
    },
    load() {
      this._loaded = true;
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
