import {
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board/index';
import Tile from 'classes/Board/Tile';
import Piece from 'classes/Piece/index';
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

export function getDirectionMoves(piece: Piece, moveDirection: MoveDirection): Move [] {
  const moves: Move [] = [];
  const change: Change = getDirectionChange(moveDirection);
  let {
    row,
    col,
  } = piece.getPosition();
  while (true) {
    row += change.drow;
    col += change.dcol;
    if (change.isValid(row, col)) {
      moves.push(new Move(piece, {row, col}));
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
  candidateMoves: Move [],
  block: number,
  action: Action
): Move [] {
  const moves: Move [] = [];
  candidateMoves.splice(block);

  let n = candidateMoves.length;
  for (let i = 0; i < n; i ++ ) {
    const move = candidateMoves[i];
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
          moves.push(move);
        }
      } else {
        moves.push(move);
      }
      return goAhead;
    };
    const previousMove = moves[i - 1];
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
): Move [] {

  let moves: Move [] = [];
  directions.forEach((direction: MoveDirection) => {
    const movesInDirection = getDirectionMoves(piece, direction);
    moves = [
      ...moves,
      ...getValidMoves(
          piece,
          board,
          movesInDirection,
          blocks,
          Action.ALLOW_BOTH
      )
    ];
  });
  return moves;
}