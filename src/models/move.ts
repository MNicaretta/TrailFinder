export enum MoveType {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export enum MoveState {
  IDLE,
  RUNNING,
  FINISHED,
  INVALID,
}

export class Move {
  private _start_x: number = 0;
  private _end_x: number = 0;

  private _start_y: number = 0;
  private _end_y: number = 0;

  private _state: MoveState = MoveState.IDLE;

  public constructor(private _type: MoveType) {}

  public get x(): number {
    switch (this._type) {
      case MoveType.RIGHT:
        return 1;
      case MoveType.LEFT:
        return -1;
    }

    return 0;
  }

  public get y(): number {
    switch (this._type) {
      case MoveType.DOWN:
        return 1;
      case MoveType.UP:
        return -1;
    }

    return 0;
  }

  public get type(): MoveType {
    return this._type;
  }

  public get start_x(): number {
    return this._start_x;
  }
  public set start_x(value: number) {
    this._start_x = value;
  }

  public get end_x(): number {
    return this._end_x;
  }
  public set end_x(value: number) {
    this._end_x = value;
  }

  public get start_y(): number {
    return this._start_y;
  }
  public set start_y(value: number) {
    this._start_y = value;
  }

  public get end_y(): number {
    return this._end_y;
  }
  public set end_y(value: number) {
    this._end_y = value;
  }

  public get state(): MoveState {
    return this._state;
  }
  public set state(value: MoveState) {
    this._state = value;
  }

  public reset() {
    this._start_x = 0;
    this._end_x = 0;

    this._start_y = 0;
    this._end_y = 0;

    this._state = MoveState.IDLE;
  }
}
