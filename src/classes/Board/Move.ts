import Piece, { PieceName } from 'classes/Piece';
import Board, { BoardType } from 'classes/Board';
import Tile, { OccupiedTile } from 'classes/Board/Tile';
import { TileCoordinate } from 'classes/index';
import MoveTransition from 'classes/Board/MoveTransition';
import Pawn from 'classes/Piece/Pawn';
import King from 'classes/Piece/King';
import Queen from 'classes/Piece/Queen';
import Rook from 'classes/Piece/Rook';
import Bishop  from 'classes/Piece/Bishop';
import Knight  from 'classes/Piece/Knight';
export default class Move {
  private readonly piece: Piece;
  private readonly destination: TileCoordinate;
  private readonly fromLocation: TileCoordinate;
  private readonly capture: Tile;
  constructor(piece: Piece, destination: TileCoordinate, capture: Tile) {
    this.piece = this.clonePiece(piece);
    this.fromLocation = piece.getPosition();
    this.destination = destination;
    this.capture = capture;
  }
  getCapturedTile(): Tile {
    return this.capture;
  }

  clonePiece(piece: Piece): Piece {
    const position = piece.getPosition();
    const alliance = piece.color;
    switch (piece.getName()) {
      case PieceName.Rook:
        return new Rook(alliance, position);
      case PieceName.Knight:
        return new Knight(alliance, position);
      case PieceName.Bishop:
        return new Bishop(alliance, position);
      case PieceName.Queen:
        return new Queen(alliance, position);
      case PieceName.King:
        return new King(alliance, position);
      default:
        return new Pawn(alliance, position);
    }
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
  execute(board: Board): MoveTransition {
    let configuration = board.getBoardConfiguration();
    const fromBoard = new Board(board, configuration);
    const from = board.getTile(this.piece.getPosition());
    board.switchTurn(this.piece.color);
    const tileCoordinates = this.destination;
    this.piece.pieceHasMoved();
    this.piece.addDistance(this.getDistance());
    this.piece.setPosition(tileCoordinates);
    configuration = board.removePieceOnTile(configuration, from);
    configuration = this.capturePiece(board, configuration);
    configuration = board.setPiece(configuration, tileCoordinates, new OccupiedTile(tileCoordinates, this.piece));
    const toBoard = new Board(board, configuration);
    const moveTransition = new MoveTransition(fromBoard, toBoard, this);
    return moveTransition;
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
  capturePiece(board: Board, configuration: BoardType): BoardType {
    const coordinates = this.capture.getCoordinates();
    const emptyTile = board.EMPTY_TILES.get(coordinates.row).get(coordinates.col);
    configuration = board.setPiece(configuration, coordinates, emptyTile);
    return configuration;
  }
}