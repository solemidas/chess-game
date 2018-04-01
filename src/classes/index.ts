import Tile from 'classes/Board/Tile';
import {
  List
} from 'immutable';
import Move from 'classes/Board/Move';
import MoveTransition from 'classes/Board/MoveTransition';
import Player from 'classes/Player';
export type BoardType = List<List<Tile>>;
export interface TileCoordinate {
  row: number;
  col: number;
}

export enum PlayerAlliance {
  WHITE = 'white',
  BLACK = 'black'
}

export  enum MoveDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}
export enum Action {
  CAPTURE, 
  ALLOW_BOTH,
  NORMAL
}
export interface BoardI<T> {
  EMPTY_TILES: BoardType;
  configuration: BoardType;
  moveMaker: PlayerAlliance;
  whitePlayer: Player;
  blackPlayer: Player;
  history: List<MoveTransition>;
  getBoardConfiguration(): BoardType;
  getPlayerTurn(): PlayerAlliance;
  getPreviousTransition(): MoveTransition;
  getBoardValue(): number;
  getCurrentPlayer(): Player;
  switchTurn(color: PlayerAlliance): void;
  undoTurn(color: PlayerAlliance): void;
  removePieceOnTile(configuration: BoardType, tile: Tile): BoardType;
  clearHighlights(configuration: BoardType): BoardType;
  setPreviousTransition(moveTransition: MoveTransition): void;
  makeMove(from: Tile, to: Tile, moves: Move []): MoveTransition;
  getHistory(): List<MoveTransition>;
  undoMove(): T;
  createEmpties(): BoardType;
  setPiece(configuration: BoardType, coordinate: TileCoordinate, tile: Tile): BoardType;
  createRooks(configuration: BoardType): BoardType;
  createKnights(configuration: BoardType): BoardType;
  createBishops(configuration: BoardType): BoardType;
  createQueens(configuration: BoardType): BoardType;
  createKings(configuration: BoardType): BoardType;
  createPawns(configuration: BoardType): BoardType;
  initialBoard(): BoardType;
  getTile(coordinate: TileCoordinate): Tile;
}

export interface BoardClass<T> {
  new(board?: BoardClass<T>, configuration?: BoardType): BoardI<T>;
}