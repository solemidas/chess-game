import Board from 'classes/Board/index';
import Tile from 'classes/Board/Tile';
import {
  PlayerAlliance,
  TileCoordinate
} from 'classes/index';
import Piece from 'classes/Piece/index';
export enum PlayerType {
  CPU,
  HUMAN
}

interface Move {
  piece: Piece;
  moves: TileCoordinate [];
}
export default class Player {
  private alliance: PlayerAlliance;
  private playerType: PlayerType;
  private opponent: Player;
  private board: Board;
  constructor(board: Board, alliance: PlayerAlliance, playerType: PlayerType) {
    this.alliance = alliance;
    this.playerType = playerType;
    this.board = board;
  }

  isCPU(): boolean {
    return this.playerType === PlayerType.CPU;
  }
  isWhite() {
    return this.alliance === PlayerAlliance.WHITE;
  }
  getOpponent(): Player {
    return this.opponent;
  }
  setOpponent(opponent: Player): void {
    if (opponent.isWhite() !== this.isWhite()) {
      this.opponent = opponent;
    } else {
      throw new Error('Opponents Shoul Not have the same alliance');
    }
  }
  getActivePieces(): void {
    //
  }
  // TODO 
  getLegalMoves(): Move [] {
    const moves: Move [] = [];
    this.board.getBoardConfiguration().forEach((row: Tile []) => {
      row.forEach((tile: Tile) => {
        const pieceOnTile = tile.getPiece();
        if (pieceOnTile) {
          moves.push({
            moves: pieceOnTile.calculateLegalMoves(this.board),
            piece: pieceOnTile
          });
        }
      });
    });
    return moves;
  }
}