
import Board from 'classes/Board/index';
import Move from 'classes/Board/Move';
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
  private distance: number;
  private moves: number;
  constructor(alliance: PlayerAlliance, position: TileCoordinate, points: number) {
    this.alliance = alliance;
    this.position = position;
    this.points = this.isWhite() ? points : -points; 
    this.moved = false;
    this.moves = 0;
    this.distance = 0;
  }
  getMoves(): number {
    return this.moves;
  }
  getDistance(): number {
    return this.distance;
  }
  addDistance(dx: number) {
    this.distance = this.distance + dx;
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
    this.moves = this.moves + 1;
  }
  hasMoved(): boolean {
    return this.moved;
  }
  isKing(): boolean {
    return this.getName() === PieceName.King;
  }
  abstract calculateLegalMoves(board: Board): Move [];
  abstract getName(): PieceName;
}