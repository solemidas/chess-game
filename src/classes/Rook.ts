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
export default class Rook extends Piece {
  static getDirections(): MoveDirection [] {
    return [
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
    return nonKnightMoves(this, board, 8, Rook.getDirections());
  }
  getName(): PieceName {
    return PieceName.Rook;
  }
}