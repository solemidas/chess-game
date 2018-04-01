import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
  Action
} from 'classes/index';
import Board from 'classes/Board';
import Move from 'classes/Board/Move';
import {
  getValidMoves,
  getDirectionMoves,
  getDiagonalChanges,
  Change
} from 'utils/chess';
import {
  List
} from 'immutable';
import Piece, { PieceName } from 'classes/Piece';
export default class Knight extends Piece {
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position, 30);
  }
  calculateLegalMoves(board: Board): List<Move> {
    const other: MoveDirection [] = [
      MoveDirection.UP,
      MoveDirection.DOWN,
      MoveDirection.LEFT,
      MoveDirection.RIGHT
    ];
    let moves: List<Move> = List();
    const pieceOnTile = board.getTile(this.position).getPiece();
    if (pieceOnTile) {
      other.forEach((direction: MoveDirection) => {
        getDiagonalChanges(direction).forEach((change: Change) => {
          const moveInDirection = getDirectionMoves(board, this, direction)[0];
          if (moveInDirection) {
            let { row, col } = moveInDirection.getDestination();
            row += change.drow;
            col += change.dcol;
            const destination = {
              row,
              col,
            };
            if (change.isValid(row, col)) {
              const move: Move = new Move(this, destination, board.getTile(destination));
              // @ts-ignore
              moves = moves.concat(getValidMoves(this, board, List([ move ]), 1, Action.ALLOW_BOTH));
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