import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board/index';
import Move from 'classes/Board/Move';
import {
  getValidMoves,
  getDirectionMoves,
  getDiagonalChanges,
  Change
} from 'utils/chess';
import Piece, { PieceName } from 'classes/Piece/index';
export default class Knight extends Piece {
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position, 30);
  }
  calculateLegalMoves(board: Board): Move [] {
    const other: MoveDirection [] = [
      MoveDirection.UP,
      MoveDirection.DOWN,
      MoveDirection.LEFT,
      MoveDirection.RIGHT
    ];
    let moves: Move [] = [];
    const pieceOnTile = board.getTile(this.position).getPiece();
    if (pieceOnTile) {
      other.forEach((direction: MoveDirection) => {
        getDiagonalChanges(direction).forEach((change: Change) => {
          const moveInDirection = getDirectionMoves(this, direction)[0];
          if (moveInDirection) {
            let { row, col } = moveInDirection.getDestination();
            row += change.drow;
            col += change.dcol;
            const move: Move = new Move(this, {row, col});
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