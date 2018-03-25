export interface TileCoordinate {
  row: number;
  col: number;
}

export enum PlayerAlliance {
  WHITE = 'white',
  BLACK = 'black'
}

export  enum MoveDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}
export enum Action {
  CAPTURE, 
  ALLOW_BOTH,
  NORMAL
}