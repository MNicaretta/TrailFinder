import { defineStore } from 'pinia';

import { Move, MoveState, type MoveType } from '@/models/move';
import { GameResult, GameState } from '@/consts/game';
import type { GamePhase, GameChar } from '@/models/game';

export const useGameStore = defineStore({
  id: 'game',
  state: () => ({
    _chars: [] as GameChar[],
    _charIndex: 1,
    _state: GameState.LOADING,
    _result: GameResult.UNDEFINED,
    _phases: [] as GamePhase[],
    _phaseIndex: 0,
    _loaded: false,
    _moves: [] as Move[],
    _moveIndex: 0,
    _loopStack: [] as { startIndex: number; count: number }[],
  }),
  getters: {
    chars: (state) => state._chars,
    currentChar: (state) => state._chars[state._charIndex],
    nextChar: (state) =>
      state._chars[(state._charIndex + 1) % state._chars.length],
    isLoading: (state) => state._state == GameState.LOADING,
    isBuilding: (state) => state._state === GameState.BUILDING,
    isPlaying: (state) => state._state === GameState.PLAYING,
    isFinished: (state) => state._state === GameState.FINISHED,
    isSuccess: (state) =>
      state._state === GameState.FINISHED &&
      state._result === GameResult.SUCCESS,
    phases: (state) => state._phases,
    currentPhase: (state) =>
      state._phases[state._phaseIndex % state._phases.length],
    isLoaded: (state) => state._loaded,
    currentMove: (state) => state._moves[state._moveIndex],
    nextMoves: (state) => state._moves.slice(state._moveIndex + 1),
    previousMoves: (state) => state._moves.slice(0, state._moveIndex),
    moves: (state) => state._moves,
  },
  actions: {
    addPhase(phase: GamePhase) {
      this._phases.push(phase);
    },
    addChar(char: GameChar) {
      this._chars.push(char);
    },
    changeChar() {
      this._charIndex = (this._charIndex + 1) % this._chars.length;
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

      this.currentPhase.movesCount =
        this._result === GameResult.SUCCESS ? this.moves.length : 0;
    },
    changePhase(index?: number) {
      this._state = GameState.BUILDING;
      this._loaded = false;
      this._moves = [];
      this._phaseIndex = index ? index : this._phaseIndex + 1;
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
    startLoop() {
      this._loopStack.unshift({ startIndex: this._moveIndex, count: 0 });
      this._moveIndex++;
    },
    endLoop() {
      const loop = this._loopStack[0];
      if (loop) {
        loop.count++;

        const startLoopMove = this._moves[loop.startIndex];

        if (loop.count < startLoopMove.repeat) {
          this.currentMove.state = MoveState.FINISHED;
          this._moves
            .slice(loop.startIndex + 1, this._moveIndex + 1)
            .forEach((move) => move.reset());
          this._moveIndex = loop.startIndex + 1;
        } else {
          this.currentMove.state = MoveState.FINISHED;
          startLoopMove.state = MoveState.FINISHED;
          this._loopStack.splice(0, 1);
          this._moveIndex++;
        }
      }
    },
  },
});
