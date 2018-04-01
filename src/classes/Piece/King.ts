import Board, { BoardType } from 'classes/Board';
import Piece, { PieceName } from 'classes/Piece';
import Move from 'classes/Board/Move';
import {
  PlayerAlliance,
  TileCoordinate,
  MoveDirection,
} from 'classes/index';
import {
  nonKnightMoves
} from 'utils/chess';
// import CastlingMove from 'classes/Board/CastlingMove';
export default class King extends Piece {
  static getDirections(): MoveDirection [] {
    return [
      MoveDirection.TOP_LEFT,
      MoveDirection.TOP_RIGHT,
      MoveDirection.BOTTOM_LEFT,
      MoveDirection.BOTTOM_RIGHT,
      MoveDirection.UP,
      MoveDirection.DOWN,
      MoveDirection.LEFT,
      MoveDirection.RIGHT
    ];
  }
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    super(alliance, position, 900);
  }
  calculateLegalMoves(board: Board): Move [] {
    let moves: Move [] = nonKnightMoves(this, board, 1, King.getDirections());
    if (this.canCastleKingSide(board)) {
      // moves.push(new CastlingMove(this, 1));
    }
    if (this.canCastleQueenSide(board)) {
      // moves.push(new CastlingMove(this, -1));
    }
    return moves;
  }
  getRook(board: Board, col: number): Piece | null {
    const {
      row,
    } = this.getPosition();
    const tile = board.getTile({row, col});
    const piece = tile.getPiece();
    if (
      piece
      && piece.getName() === PieceName.Rook
      && piece.color === this.color
      && !piece.hasMoved()
    ) {
      console.log(piece);
      return piece;
    }
    return null;
  }
  getLeftRook(board: Board): Piece | null {
    return this.getRook(board, 0);
  }
  getRightRook(board: Board): Piece | null {
    return this.getRook(board, 7);
  }
  getBoundary(dy: number): number {
    return dy > 0 ? 7 : 0;
  }
  canCastle(board: Board, dy: number): boolean {
    const {row, col: y } = this.getPosition();
    let canCastle = true;
    const boundary = this.getBoundary(dy);
    const isValid = (i: number) => {
      return boundary === 7 ? i < 7 : i > 0;
    };
    for (let col = y + dy; isValid(col); col = col + dy) {
      console.log(col);
      const tile = board.getTile({row, col});
      const piece = tile.getPiece();
      if (piece) {
        canCastle = false;
        break;
      }
    }

    return canCastle;
  }

  canCastleKingSide(board: Board): boolean {
    return this.canCastle(board, 1);
  }
  canCastleQueenSide(board: Board): boolean {
    return this.canCastle(board, -1);
  }
  castle(configuration: BoardType, board: Board, dy: number): BoardType {
    const {row, col} = this.getPosition();
    const newKingPosition = {row, col: col + 2 * dy};
    const newRookPosition = {row, col: col + dy};
    const kingTile = board.getTile(this.getPosition());
    const rookTile = board.getTile({row, col: this.getBoundary(dy)});
    configuration = board.removePieceOnTile(configuration, kingTile);
    configuration = board.removePieceOnTile(configuration, rookTile);
    configuration = board.setPiece(configuration, newRookPosition, rookTile);
    configuration = board.setPiece(configuration, newKingPosition, kingTile);
    return configuration;
  }
  getName(): PieceName {
    return PieceName.King;
  }
}