
import Board from 'classes/Board/index';
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
  protected points: number;
  protected moved: boolean;
  constructor(alliance: PlayerAlliance, position: TileCoordinate, points: number) {
    this.alliance = alliance;
    this.position = position;
    this.points = this.isWhite() ? points : -points; 
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
  getPoints(): number {
    return this.points;
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
  isKing(): boolean {
    return this.getName() === PieceName.King;
  }
  abstract calculateLegalMoves(board: Board): TileCoordinate [];
  abstract getName(): PieceName;
}