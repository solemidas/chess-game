import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
} from 'classes/index';
import Board from 'classes/Board/index';
import Piece, { PieceName } from 'classes/Piece/index';
import Move from 'classes/Board/Move';
import {
  nonKnightMoves
} from 'utils/chess';
export default class Queen extends Piece {
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
    super(alliance, position, 90);
  }
  calculateLegalMoves(board: Board): Move [] {
    return nonKnightMoves(this, board, 8, Queen.getDirections());
  }
  getName(): PieceName {
    return PieceName.Queen;
  }
}