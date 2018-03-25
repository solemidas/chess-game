import {
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board';
import Tile from 'classes/Tile';
import Piece from 'classes/Piece';
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

export function getDirectionMoves(position: TileCoordinate, moveDirection: MoveDirection): TileCoordinate [] {
  const moves: TileCoordinate [] = [];
  const change: Change = getDirectionChange(moveDirection);
  let {
    row,
    col,
  } = position;
  while (true) {
    row += change.drow;
    col += change.dcol;
    if (change.isValid(row, col)) {
      moves.push({
        row, col
      });
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
  candidateMoves: TileCoordinate [],
  block: number,
  action: Action
): TileCoordinate [] {
  const moves: TileCoordinate [] = [];
  candidateMoves.splice(block);

  let n = candidateMoves.length;
  for (let i = 0; i < n; i ++ ) {
    const move = candidateMoves[i];
    const tile = board.getTile(move);
    const pieceOnTile = tile.getPiece();
    if (pieceOnTile && pieceOnTile.color !== piece.color && allowMove(tile, action)) {
      const previousMove = moves[i - 1];
      if (previousMove) {
        const previousTile = board.getTile(previousMove);
        const pieceOnPreviousTile = previousTile.getPiece();
        if (pieceOnPreviousTile && pieceOnPreviousTile.color === pieceOnTile.color) {
          break;
        } else {
          moves.push(move);
        }
      } else {
        moves.push(move);
      }
    } else if (!pieceOnTile && allowMove(tile, action)) {
      moves.push(move);
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
): TileCoordinate [] {

  let moves: TileCoordinate [] = [];
  directions.forEach((direction: MoveDirection) => {
    const movesInDirection = getDirectionMoves(piece.getPosition(), direction);
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