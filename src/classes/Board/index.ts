import Tile, { EmptyTile, OccupiedTile } from 'classes/Board/Tile';
import {
  List
} from 'immutable';
import Move from 'classes/Board/Move';
import MoveTransition from 'classes/Board/MoveTransition';
import Player, { PlayerType } from 'classes/Player';
import * as Pieces from 'classes/Pieces';
import {
  PlayerAlliance,
  TileCoordinate,
} from 'classes/index';
export type BoardType = List<List<Tile>>;
export default class Board {
  public EMPTY_TILES: BoardType;
  private configuration: BoardType;
  private moveMaker: PlayerAlliance;
  private whitePlayer: Player;
  private blackPlayer: Player;
  private history: List<MoveTransition>;
  constructor(board?: Board, configuration?: BoardType) {
    if (board && configuration) {
      const newBoard: Board = Object.create(board);
      this.configuration = configuration;
      this.whitePlayer = newBoard.whitePlayer;
      this.blackPlayer = newBoard.blackPlayer;
      this.history = newBoard.history;
      this.moveMaker = newBoard.moveMaker;
      this.EMPTY_TILES = newBoard.EMPTY_TILES;
    } else {
      this.EMPTY_TILES = this.createEmpties();
      this.configuration = this.initialBoard();
      this.moveMaker = PlayerAlliance.WHITE;
      this.whitePlayer = new Player(PlayerAlliance.WHITE, PlayerType.CPU);
      this.blackPlayer = new Player(PlayerAlliance.BLACK, PlayerType.HUMAN);
      this.whitePlayer.setOpponent(this.blackPlayer);
      this.blackPlayer.setOpponent(this.whitePlayer);
      this.history = List();
    }
  }
  getBoardConfiguration(): BoardType {
    return this.configuration;
  }
  getPlayerTurn(): PlayerAlliance {
    return this.moveMaker;
  }
  getPreviousTransition(): MoveTransition {
    const n = this.history.size;
    return this.history.get(n - 1);
  }
  getPlayerLegalMoves(player: Player) {
    //
  }
  getBoardValue(): number {
    const sum = this.configuration.reduce((rowMemo: number, row: List<Tile>) => {
      return rowMemo + row.reduce((colMemo: number, tile: Tile) => {
        const piece = tile.getPiece();
        const points = piece ? piece.getPoints() : 0;
        return colMemo + points;
      }, 0);
    }, 0);
    return sum;
  }
  getCurrentPlayer(): Player {
    return this.getPlayerTurn() === PlayerAlliance.WHITE ? 
      this.whitePlayer :
      this.blackPlayer;
  }
  switchTurn(color: PlayerAlliance) {
    this.moveMaker = color === PlayerAlliance.WHITE ?
    PlayerAlliance.BLACK :
    PlayerAlliance.WHITE;
  }
  undoTurn(color: PlayerAlliance) {
    this.moveMaker = color === PlayerAlliance.WHITE ?
    PlayerAlliance.WHITE :
    PlayerAlliance.BLACK;
  }
  removePieceOnTile(configuration: BoardType, tile: Tile): BoardType {
    const coordinates: TileCoordinate = tile.getCoordinates();
    return this.setPiece(configuration, coordinates, new EmptyTile(coordinates));
  }
  clearHighlights(configuration: BoardType) {
    let newConfiguration: BoardType = List();
    configuration.forEach((row: List<Tile>, i: number) => {
      let rowTiles: List<Tile> = List();
      row.forEach((tile: Tile, j: number) => {
        tile.clearHighlight();
        rowTiles = rowTiles.push(tile);
      });
      newConfiguration = newConfiguration.push(rowTiles);
    });
    return newConfiguration;
  }
  setPreviousTransition(moveTransition: MoveTransition) {
    const history = this.history.push(moveTransition);
    this.history = history;
  }
  makeMove(move: Move): MoveTransition {
    return move.execute(this);
  }
  popHistory() {
    this.history = this.history.pop();
  }
  getHistory(): List<MoveTransition> {
    return this.history;
  }
  undoMove() {
    const transition: MoveTransition = this.getPreviousTransition();
    let board: Board = this;
    if (transition) {
      board = transition.getFromBoard();
      // board.undoTurn(alliance);
    }
    let configuration = board.getBoardConfiguration();
    configuration = this.clearHighlights(configuration);
    return board;
}
  createEmpties(): BoardType {
    // @ts-ignore
    let board: BoardType = List();
    for (let i = 0; i < 8; i++) {
      let row: List<Tile> = List();
      for (let j = 0; j < 8; j++) {
        row = row.push(new EmptyTile({
          row: i,
          col: j
        }));
      }
      board = board.push(row);
    }
    return board;
  }
  setPiece(configuration: BoardType, coordinate: TileCoordinate, tile: Tile): BoardType {
    const { row: x, col: y} = coordinate;
    const row = configuration.get(x);
    const newRow = row.update(y, () => tile);
    configuration = configuration.update(x, () => newRow);
    return configuration;
  }
  createRooks(configuration: BoardType) {
    const coordinates: number [] = [0, 7];
    coordinates.forEach((i: number) => {
      coordinates.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const rook = new Pieces.Rook(alliance, position);
        configuration = this.setPiece(configuration, position, new OccupiedTile(position, rook));
      });
    });
    return configuration;
  }
  createKnights(configuration: BoardType) {
    const rows: number [] = [0, 7];
    const columns: number [] = [1, 6];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const knight = new Pieces.Knight(alliance, position);
        configuration = this.setPiece(configuration, position, new OccupiedTile(position, knight));
      });
    });
    return configuration;
  }
  createBishops(configuration: BoardType) {
    const rows: number [] = [0, 7];
    const columns: number [] = [2, 5];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const bishop = new Pieces.Bishop(alliance, position);
        configuration = this.setPiece(configuration, position, new OccupiedTile(position, bishop));
      });
    });
    return configuration;
  }
  createQueens(configuration: BoardType) {
    const rows: number [] = [0, 7];
    const columns: number [] = [3];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const queen = new Pieces.Queen(alliance, position);
        configuration = this.setPiece(configuration, position, new OccupiedTile(position, queen));
      });
    });
    return configuration;
  }
  createKings(configuration: BoardType) {
    const rows: number [] = [0, 7];
    const columns: number [] = [4];
    rows.forEach((i: number) => {
      columns.forEach((j: number) => {
        const alliance: PlayerAlliance = i === 0 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const king = new Pieces.King(alliance, position);
        configuration = this.setPiece(configuration, position, new OccupiedTile(position, king));
      });
    });
    return configuration;
  }
  createPawns(configuration: BoardType) {
    const rows: number [] = [1, 6];
    rows.forEach((i: number) => {
      for (let j = 0; j < 8 ; j++) {
        const alliance: PlayerAlliance = i === 1 ? PlayerAlliance.WHITE : PlayerAlliance.BLACK;
        const position: TileCoordinate = {row: i, col: j};
        const pawn = new Pieces.Pawn(alliance, position);
        configuration = this.setPiece(configuration, position, new OccupiedTile(position, pawn));
      }
    });
    return configuration;
  }
  initialBoard() {
    let configuration = this.createRooks(this.EMPTY_TILES);
    configuration = this.createKnights(configuration);
    configuration = this.createBishops(configuration);
    configuration = this.createQueens(configuration);
    configuration = this.createKings(configuration);
    return this.createPawns(configuration);
  }
  getTile(coordinate: TileCoordinate): Tile {
    const { row, col } = coordinate;
    return this.configuration.get(row).get(col);
  }

}