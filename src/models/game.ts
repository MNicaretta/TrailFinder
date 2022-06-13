export class GamePhase {
  private _movesCount: number = 0;
  private _minMoves: number;
  private _width: number;
  private _height: number;

  public constructor(
    private _name: string,
    private _thumbnail: string,
    phase: { minmoves: number; width: number; height: number }
  ) {
    this._minMoves = phase.minmoves;
    this._width = phase.width;
    this._height = phase.height;
  }

  public get name() {
    return this._name;
  }

  public get thumbnail() {
    return this._thumbnail;
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
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
