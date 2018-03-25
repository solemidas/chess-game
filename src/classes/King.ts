import Board from 'classes/Board';
import Piece, { PieceName } from 'classes/Piece';
import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
} from 'classes/index';
import {
  nonKnightMoves
} from 'utils/chess';
export default class King extends Piece {
  static getDirections(): MoveDirection [] {
    return [
      MoveDirection.TOP_LEFT,
      MoveDirection.TOP_RIGHT,
      MoveDirection.BOTTOM_LEFT,
      MoveDirection.BOTTOM_RIGHT,
      MoveDirection.UP,
      MoveDirection.DOWN,
      MoveDirection.LEFT,
      MoveDirection.RIGHT
    ];
  }
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position);
  }
  calculateLegalMoves(board: Board): TileCoordinate [] {
    return nonKnightMoves(this, board, 1, King.getDirections());
  }
  getName(): PieceName {
    return PieceName.King;
  }
}