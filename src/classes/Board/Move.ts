import Piece from 'classes/Piece';
import Board from 'classes/Board';
import Tile, { EmptyTile, OccupiedTile } from 'classes/Board/Tile';
import { TileCoordinate } from 'classes/index';
export default class Move {
  private readonly piece: Piece;
  private readonly destination: TileCoordinate;
  private readonly fromLocation: TileCoordinate;
  private readonly capture: Tile;
  constructor(piece: Piece, destination: TileCoordinate, capture: Tile) {
    this.piece = piece;
    this.fromLocation = piece.getPosition();
    this.destination = destination;
    this.capture = capture;
  }
  getCapturedTile(): Tile {
    return this.capture;
  }
  getPiecePosition(): TileCoordinate {
    return this.fromLocation;
  }
  getDestination(): TileCoordinate {
    return this.destination;
  }
  getMovedPiece(): Piece {
    return this.piece;
  }
  execute(board: Board) {
      const from = board.getTile(this.piece.getPosition());
      board.switchTurn(this.piece);
      const tileCoordinates = this.destination;
      this.piece.pieceHasMoved();
      this.piece.addDistance(this.getDistance());
      this.piece.setPosition(tileCoordinates);
      board.removePieceOnTile(from);
      board.setPreviousMove(this);
      this.capturePiece(board);
      board.setPiece(tileCoordinates, new OccupiedTile(tileCoordinates, this.piece));
  }
  getDistance(): number {
    let distance = 0;
    const destinationTile = this.destination;
    const fromTile = this.fromLocation;
    if (fromTile.col === destinationTile.col) {
      distance = fromTile.row - destinationTile.row;
    }
    return distance < 0 ? -distance : distance;
  }
  capturePiece(board: Board): void {
    if (this.capture) {
      const coordinates = this.capture.getCoordinates();
      board.setPiece(coordinates, new EmptyTile(coordinates));
    }
  }
}