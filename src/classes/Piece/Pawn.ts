import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board/index';
import Piece, { PieceName } from 'classes/Piece/index';
import {
  getValidMoves,
  getDirectionMoves,
} from 'utils/chess';
export default class Pawn extends Piece {
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position, 10);
  }
  getDiagonalDirections(): MoveDirection [] {
    if (!this.isWhite()) {
      return [MoveDirection.TOP_LEFT, MoveDirection.TOP_RIGHT];
    }
    return [MoveDirection.BOTTOM_LEFT, MoveDirection.BOTTOM_RIGHT];
  }
  getVerticalDirection(): MoveDirection {
    if (!this.isWhite()) {
      return MoveDirection.UP;
    }
    return MoveDirection.DOWN;
  }
  calculateLegalMoves(board: Board): TileCoordinate [] {
    let diagonalMoves: TileCoordinate [] = [];
    let verticalMoves: TileCoordinate [] = [];
    const diagonalDirections: MoveDirection [] = this.getDiagonalDirections();
    diagonalDirections.forEach((direction: MoveDirection) => {
      const diagonals = getDirectionMoves(this.position, direction);
      diagonalMoves = [
        ...diagonalMoves,
        ...getValidMoves(this, board, diagonals, 1, Action.CAPTURE)
      ];
    });
    const verticalDirection: MoveDirection = this.getVerticalDirection();
    const blocks = this.hasMoved() ? 1 : 2;
    let verticals = getDirectionMoves(this.position, verticalDirection);
    verticalMoves = getValidMoves(this, board, verticals, blocks, Action.NORMAL);
    let moves: TileCoordinate [] = [
      ...diagonalMoves,
      ...verticalMoves
    ]; 
    return moves;
  }
  getName(): PieceName {
    return PieceName.Pawn;
  }
}