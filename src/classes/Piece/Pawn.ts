import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board/index';
import Move from 'classes/Board/Move';
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
  calculateLegalMoves(board: Board): Move [] {
    let diagonalMoves: Move [] = [];
    let verticalMoves: Move [] = [];
    const diagonalDirections: MoveDirection [] = this.getDiagonalDirections();
    diagonalDirections.forEach((direction: MoveDirection) => {
      const diagonals = getDirectionMoves(this, direction);
      diagonalMoves = [
        ...diagonalMoves,
        ...getValidMoves(this, board, diagonals, 1, Action.CAPTURE)
      ];
    });
    const verticalDirection: MoveDirection = this.getVerticalDirection();
    const blocks = this.hasMoved() ? 1 : 2;
    let verticals = getDirectionMoves(this, verticalDirection);
    verticalMoves = getValidMoves(this, board, verticals, blocks, Action.NORMAL);
    const enPassantMove = this.enPassant(board);
    if (enPassantMove) {
      diagonalMoves.push(enPassantMove);
    }
    let moves: Move [] = [
      ...diagonalMoves,
      ...verticalMoves
    ];
    return moves;
  }
  enPassant(board: Board): Move | null {
    const previousMove = board.getPreviousMove();
    if (previousMove) {
      const movedPiece = previousMove.getMovedPiece();
      const isPawn = movedPiece.getName() === PieceName.Pawn;
      if (isPawn) {
        const destination = previousMove.getDestination();
        if (destination.row === this.getPosition().row
          && previousMove.getMovedPiece().getDistance() === 2
          && previousMove.getMovedPiece().getMoves() === 1
        ) {
          const verticalDirection: MoveDirection = this.getVerticalDirection();
          let vertical = getDirectionMoves(this, verticalDirection)[0];
          const tileBehind: TileCoordinate = {
            col: destination.col,
            row: vertical.getDestination().row
          };
          return new Move(this, tileBehind, board.getTile(destination));
        }
      }
    }
    return null;
  }
  getName(): PieceName {
    return PieceName.Pawn;
  }
}