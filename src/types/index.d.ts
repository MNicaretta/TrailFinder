interface Move {
  x: 1 | 0 | -1,
  y: 1 | 0 | -1,

  start_x?: number,
  end_x?: number,

  start_y?: number,
  end_y?: number,
}