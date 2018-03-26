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
    super(alliance, position, 50);
  }
  calculateLegalMoves(board: Board): Move [] {
    return nonKnightMoves(this, board, 8, Rook.getDirections());
  }
  getName(): PieceName {
    return PieceName.Rook;
  }
}