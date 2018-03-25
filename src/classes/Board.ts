import * as _ from 'lodash';
import Tile, { EmptyTile, OccupiedTile } from 'classes/Tile';
import * as Pieces from 'classes/Pieces';
import {
  PlayerAlliance,
  TileCoordinate,
} from 'classes/index';
export type BoardType = [Tile []];
export default class Board {
  configuration: BoardType;
  pieces: string [];
  constructor() {
    this.configuration = this.createEmpties();
    this.initialBoard();
  }
  getBoardConfiguration(): BoardType {
    return this.configuration;
  }
  removePieceOnTile(tile: Tile) {
    const coordinates: TileCoordinate = tile.getCoordinates();
    this.setPiece(coordinates, new EmptyTile(coordinates));
  }
  clearHighlights(moves: TileCoordinate []) {
    moves.forEach((move: TileCoordinate) => {
      this.getTile(move).clearHighlight();
    });
  }
  makeMove(from: Tile, to: Tile, moves: TileCoordinate []): BoardType {
    // const previousTileCoordinate: TileCoordinate = from.getCoordinates();
    const legalMove = _.find(moves, (move: TileCoordinate) => {
      return move.col === to.getCoordinates().col && to.getCoordinates().row && move.row;
    });
    const pieceOnTile = from.getPiece();
    if (legalMove && pieceOnTile) {
      const tileCoordinates = to.getCoordinates();
      pieceOnTile.pieceHasMoved();
      pieceOnTile.setPosition(tileCoordinates);
      this.removePieceOnTile(from);
      this.setPiece(tileCoordinates, new OccupiedTile(tileCoordinates, pieceOnTile));
    }
    this.clearHighlights(moves);
    return this.configuration;
  }
  createEmpties(): BoardType {
    // @ts-ignore
    const board: BoardType = [];
    for (let i = 0; i < 8; i++) {
      const row: Tile [] = [];
      for (let j = 0; j < 8; j++) {
        row.push(new EmptyTile({
          row: i,
          col: j
        }));
      }
      board.push(row);
    }
    return board;
  }
  setPiece(coordinate: TileCoordinate, tile: Tile) {
    this.configuration[coordinate.row][coordinate.col] = tile;
  }
  createRooks() {
    const coordinates: number [] = [0, 7];
    coordinates.forEach((i: number) => {
      coordinates.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const rook = new Pieces.Rook(alliance, position);
        this.setPiece(position, new OccupiedTile(position, rook));
      });
    });
  }
  createKnights() {
    const rows: number [] = [0, 7];
    const columns: number [] = [1, 6];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const knight = new Pieces.Knight(alliance, position);
        this.setPiece(position, new OccupiedTile(position, knight));
      });
    });
  }
  createBishops() {
    const rows: number [] = [0, 7];
    const columns: number [] = [2, 5];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const bishop = new Pieces.Bishop(alliance, position);
        this.setPiece(position, new OccupiedTile(position, bishop));
      });
    });
  }
  createQueens() {
    const rows: number [] = [0, 7];
    const columns: number [] = [3];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const queen = new Pieces.Queen(alliance, position);
        this.setPiece(position, new OccupiedTile(position, queen));
      });
    });
  }
  createKings() {
    const rows: number [] = [0, 7];
    const columns: number [] = [4];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const king = new Pieces.King(alliance, position);
        this.setPiece(position, new OccupiedTile(position, king));
      });
    });
  }
  createPawns() {
    const rows: number [] = [1, 6];
    rows.forEach((i: number) => {
      for (let j = 0; j < 8 ; j++) {
        const alliance: PlayerAlliance = i === 1 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const pawn = new Pieces.Pawn(alliance, position);
        this.setPiece(position, new OccupiedTile(position, pawn));
      }
    });
  }
  initialBoard() {
    this.createRooks();
    this.createKnights();
    this.createBishops();
    this.createQueens();
    this.createKings();
    this.createPawns();
  }
  getTile(coordinate: TileCoordinate): Tile {
    return this.configuration[coordinate.row][coordinate.col];
  }

}