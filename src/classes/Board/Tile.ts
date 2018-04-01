import Piece from 'classes/Piece';
import {
  TileCoordinate,
} from 'classes/index';
export default abstract class Tile {
  protected position: TileCoordinate;
  protected highlight: boolean;
  constructor(position: TileCoordinate) {
    this.position = position;
    this.highlight = false;
  }
  highlightTile() { 
    this.highlight = true;
  }

  clearHighlight(): Tile {
    this.highlight = false;
    return this;
  }
  getCoordinates(): TileCoordinate {
    return this.position;
  }
  isHighlighted(): boolean {
    return this.highlight;
  }
  abstract isTileOccupied(): boolean;
  abstract getPiece(): Piece | null;
}

export class EmptyTile extends Tile {
  constructor(position: TileCoordinate) {
    super(position);
  }
  isTileOccupied(): boolean {
    return false;
  }
  getPiece() {
    return null;
  }
}

export class OccupiedTile extends Tile {
  private pieceOnTile: Piece;
  constructor(position: TileCoordinate, piece: Piece) {
    super(position);
    this.pieceOnTile = piece;
    this.pieceOnTile.setPosition(position);
  }
  isTileOccupied(): boolean {
    return true;
  }
  getPiece(): Piece {
    return this.pieceOnTile;
  }
}