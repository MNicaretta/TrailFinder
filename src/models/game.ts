export class GamePhase {
  private _movesCount: number = 0;

  public constructor(private _name: string, private _minMoves: number) {}

  public get name() {
    return this._name;
  }

  public get isFinished() {
    return this._movesCount > 0;
  }

  public get isMinMoves() {
    return this.isFinished && this._movesCount <= this._minMoves;
  }

  public set movesCount(value: number) {
    this._movesCount = value;
  }
}

export class GameChar {
  public constructor(private _name: string) {}

  public get name() {
    return this._name;
  }
}
