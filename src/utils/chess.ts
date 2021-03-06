import {
  MoveDirection,
  Action
} from 'classes/index';
import {
  List
} from 'immutable';
import Board from 'classes/Board';
import Tile from 'classes/Board/Tile';
import Piece from 'classes/Piece';
import Move from 'classes/Board/Move';
export interface Change {
  drow: number;
  dcol: number;
  isValid: (row: number, col: number) => boolean;
}

export function getDirectionChange(moveDirection: MoveDirection): Change {
  let drow = 0;
  let dcol = 0;
  let isValid = (row: number, col: number) => false;
  switch (moveDirection) {
    case MoveDirection.TOP_RIGHT:
      drow -= 1;
      dcol += 1;
      isValid = (row: number, col: number) => row > -1 && col < 8;
      break;
    case MoveDirection.TOP_LEFT:
      drow -= 1;
      dcol -= 1;
      isValid = (row: number, col: number) => row > -1 && col > -1;
      break;
    case MoveDirection.BOTTOM_RIGHT:
      drow += 1;
      dcol += 1;
      isValid = (row: number, col: number) => row < 8 && col < 8;
      break;
    case MoveDirection.BOTTOM_LEFT:
      drow += 1;
      dcol -= 1;
      isValid = (row: number, col: number) => row < 8 && col > -1;
      break;
    case MoveDirection.UP:
      drow -= 1;
      isValid = (row: number, col: number) => row > -1;
      break;
    case MoveDirection.DOWN:
      drow += 1;
      isValid = (row: number, col: number) => row < 8;
      break;
    case MoveDirection.LEFT:
      dcol -= 1;
      isValid = (row: number, col: number) => col > -1;
      break;
    case MoveDirection.RIGHT:
      dcol += 1;
      isValid = (row: number, col: number) => col < 8;
      break;
    default:
      break;
  }
  return {
    drow,
    dcol,
    isValid,
  };
}

export function getDirectionMoves(board: Board, piece: Piece, moveDirection: MoveDirection): List<Move> {
  let moves: List<Move> = List();
  const change: Change = getDirectionChange(moveDirection);
  let {
    row,
    col,
  } = piece.getPosition();
  while (true) {
    row += change.drow;
    col += change.dcol;
    const destination = {
      row,
      col,
    };
    if (change.isValid(row, col)) {
      moves = moves.push(new Move(piece, destination, board.getTile(destination)));
    } else {
      break;
    }
  }
  return moves;
}

export function getDiagonalChanges(moveDirection: MoveDirection): Change [] {
  let changes: Change [] = [];
  switch (moveDirection) {
    case MoveDirection.UP:
      changes.push(getDirectionChange(MoveDirection.TOP_RIGHT));
      changes.push(getDirectionChange(MoveDirection.TOP_LEFT));
      break;
    case MoveDirection.DOWN:
      changes.push(getDirectionChange(MoveDirection.BOTTOM_LEFT));
      changes.push(getDirectionChange(MoveDirection.BOTTOM_RIGHT));
      break;
    case MoveDirection.LEFT:
      changes.push(getDirectionChange(MoveDirection.TOP_LEFT));
      changes.push(getDirectionChange(MoveDirection.BOTTOM_LEFT));
      break;
    case MoveDirection.RIGHT:
      changes.push(getDirectionChange(MoveDirection.TOP_RIGHT));
      changes.push(getDirectionChange(MoveDirection.BOTTOM_RIGHT));
      break;
    default:
      break;
  }
  return changes;
}
export function allowMove(tile: Tile, action: Action): boolean {
  switch (action) {
    case Action.CAPTURE:
      return tile.isTileOccupied();
    case Action.NORMAL:
      return !tile.isTileOccupied();
    default:
      return true;
  }
}
export function getValidMoves(
  piece: Piece,
  board: Board,
  candidateMoves: List<Move>,
  block: number,
  action: Action
): List<Move> {
  let moves: List<Move> = List();
  // @ts-ignore
  candidateMoves = candidateMoves.splice(block);

  let n = candidateMoves.size;
  for (let i = 0; i < n; i ++ ) {
    const move = candidateMoves.get(i);
    const tile = board.getTile(move.getDestination());
    const pieceOnTile = tile.getPiece();
    const conitnueSearching = (previousCoordinate: Move): boolean => {
      let goAhead = true;
      if (previousCoordinate) {
        const previousTile = board.getTile(previousCoordinate.getDestination());
        const pieceOnPreviousTile = previousTile.getPiece();
        if (pieceOnPreviousTile) {
          goAhead = false;
        } else {
          moves = moves.push(move);
        }
      } else {
        moves = moves.push(move);
      }
      return goAhead;
    };
    const previousMove = moves.get(i - 1);
    if (pieceOnTile && pieceOnTile.color !== piece.color && allowMove(tile, action)) {
      const goAhead = conitnueSearching(previousMove);
      if (!goAhead) {
        break;
      }
    } else if (!pieceOnTile && allowMove(tile, action)) {
      const goAhead = conitnueSearching(previousMove);
      if (!goAhead) {
        break;
      }
    } else {
      break;
    }
  }
  return moves;
}

export function nonKnightMoves(
  piece: Piece,
  board: Board,
  blocks: number,
  directions: MoveDirection []
): List<Move> {

  let moves: List<Move> = List();
  directions.forEach((direction: MoveDirection) => {
    const movesInDirection = getDirectionMoves(board, piece, direction);
    // @ts-ignore
    moves = moves.concat(
      getValidMoves(
        piece,
        board,
        movesInDirection,
        blocks,
        Action.ALLOW_BOTH
      )
    );
  });
  return moves;
}