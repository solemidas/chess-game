import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board';
import {
  getValidMoves,
  getDirectionMoves,
  getDiagonalChanges,
  Change
} from 'utils/chess';
import Piece, { PieceName } from 'classes/Piece';
export default class Knight extends Piece {
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position);
  }
  calculateLegalMoves(board: Board): TileCoordinate [] {
    const other: MoveDirection [] = [
      MoveDirection.UP,
      MoveDirection.DOWN,
      MoveDirection.LEFT,
      MoveDirection.RIGHT
    ];
    let moves: TileCoordinate [] = [];
    const pieceOnTile = board.getTile(this.position).getPiece();
    if (pieceOnTile) {
      other.forEach((direction: MoveDirection) => {
        getDiagonalChanges(direction).forEach((change: Change) => {
          const moveInDirection = getDirectionMoves(this.position, direction)[0];
          if (moveInDirection) {
            let { row, col } = moveInDirection;
            row += change.drow;
            col += change.dcol;
            const move: TileCoordinate = {
              row, col,
            };
            if (change.isValid(row, col)) {
              moves = [...moves, ...getValidMoves(this, board, [ move ], 1, Action.ALLOW_BOTH)];
            }
          }
        });
      });
    }
    return moves;
  }
  getName(): PieceName {
    return PieceName.Knight;
  }
}