
import Board from 'classes/Board';
import {
  PlayerAlliance,
  TileCoordinate,
} from 'classes/index';
export enum PieceName {
  King = 'King',
  Queen = 'Queen',
  Rook = 'Rook',
  Knight = 'Knight',
  Pawn = 'Pawn',
  Bishop = 'Bishop'
}
export default abstract class Piece {
  protected alliance: PlayerAlliance;
  protected position: TileCoordinate;
  protected moved: boolean;
  constructor(alliance: PlayerAlliance, position: TileCoordinate) {
    this.alliance = alliance;
    this.position = position;
    this.moved = false;
  }

  isWhite(): boolean {
    return this.alliance === PlayerAlliance.WHITE;
  }
  get color(): PlayerAlliance {
    return this.alliance;
  }
  setPosition(position: TileCoordinate) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }
  pieceHasMoved(): void {
    this.moved = true;
  }
  hasMoved(): boolean {
    return this.moved;
  }
  abstract calculateLegalMoves(board: Board): TileCoordinate [];
  abstract getName(): PieceName;
}