import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
} from 'classes/index';
import Board from 'classes/Board';
import Piece, { PieceName } from 'classes/Piece';
import {
  nonKnightMoves
} from 'utils/chess';
export default class Bishop extends Piece {
  static getDirections(): MoveDirection [] {
    return [
      MoveDirection.TOP_LEFT,
      MoveDirection.TOP_RIGHT,
      MoveDirection.BOTTOM_LEFT,
      MoveDirection.BOTTOM_RIGHT,
    ];
  }
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position);
  }
  calculateLegalMoves(board: Board): TileCoordinate [] {
    return nonKnightMoves(this, board, 8, Bishop.getDirections());
  }
  getName(): PieceName {
    return PieceName.Bishop;
  }
}