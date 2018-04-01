import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import {
  List
} from 'immutable';
import Board from 'classes/Board';
import Move from 'classes/Board/Move';
import Piece, { PieceName } from 'classes/Piece';
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
  calculateLegalMoves(board: Board): List<Move> {
    let diagonalMoves: List<Move> = List();
    let verticalMoves: List<Move> = List();
    const diagonalDirections: MoveDirection [] = this.getDiagonalDirections();
    diagonalDirections.forEach((direction: MoveDirection) => {
      const diagonals = getDirectionMoves(board, this, direction);
      // @ts-ignore
      diagonalMoves = diagonalMoves.concat(
        getValidMoves(
          this,
          board,
          diagonals,
          1,
          Action.CAPTURE
        )
      );
    });
    const verticalDirection: MoveDirection = this.getVerticalDirection();
    const blocks = this.hasMoved() ? 1 : 2;
    let verticals = getDirectionMoves(board, this, verticalDirection);
    verticalMoves = getValidMoves(this, board, verticals, blocks, Action.NORMAL);
    const enPassantMove = this.enPassant(board);
    if (enPassantMove) {
      diagonalMoves.push(enPassantMove);
    }
    // @ts-ignore
    let moves: List<Move> = diagonalMoves.concat(verticalMoves);
    return moves;
  }
  enPassant(board: Board): Move | null {
    const moveTransition =  board.getPreviousTransition();
    if (moveTransition) {
      const previousMove = moveTransition.getTransitionMove();
      const movedPiece = previousMove.getMovedPiece();
      const isPawn = movedPiece.getName() === PieceName.Pawn;
      if (isPawn) {
        const destination = previousMove.getDestination();
        if (destination.row === this.getPosition().row
          && previousMove.getMovedPiece().getDistance() === 2
          && previousMove.getMovedPiece().getMoves() === 1
        ) {
          const verticalDirection: MoveDirection = this.getVerticalDirection();
          let vertical = getDirectionMoves(board, this, verticalDirection)[0];
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