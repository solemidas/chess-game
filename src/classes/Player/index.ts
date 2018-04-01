import Board from 'classes/Board';
import MiniMax from 'classes/Player/AI/MiniMax';
import Piece from 'classes/Piece';
import Tile from 'classes/Board/Tile';
import {
  List
} from 'immutable';
import {
  PlayerAlliance,
} from 'classes/index';
export enum PlayerType {
  CPU,
  HUMAN
}

import Move from 'classes/Board/Move';
export default class Player extends MiniMax {
  private readonly alliance: PlayerAlliance;
  private readonly playerType: PlayerType;
  private opponent: Player;
  private readonly board: Board;
  constructor(board: Board, alliance: PlayerAlliance, playerType: PlayerType) {
    super();
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
  getAlliance(): PlayerAlliance {
    return this.alliance;
  }
  getOpponent(): Player {
    return this.opponent;
  }
  getKing(): Piece {
    let piece: Piece;
    this.board.getBoardConfiguration().toJS().forEach((row: List<Tile>) => {
      row.forEach((tile: Tile) => {
        const pieceOnTile = tile.getPiece();
        if (pieceOnTile && !piece) {
          if (pieceOnTile.isKing() && pieceOnTile.color === this.alliance) {
            piece = pieceOnTile;
          }
        }
      });
    });
    // @ts-ignore
    return piece;
  }

  isInCheck(): boolean {
    const king = this.getKing();
    if (king) {
      const position = king.getPosition();
      const moves: Move [] = [];
      this.getOpponent().getLegalMoves().forEach((move) => {
        const destination = move.getDestination();
        if (position.row === destination.row && position.col === destination.col) {
          moves.push(move);
        }
      });
      return moves.length > 0;
    }
    return true;
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
    let moves: Move [] = [];
    this.board.getBoardConfiguration().forEach((row: List<Tile>) => {
      row.forEach((tile: Tile) => {
        const pieceOnTile = tile.getPiece();
        if (pieceOnTile && pieceOnTile.color === this.alliance) {
          moves = [
            ...moves,
            ...pieceOnTile.calculateLegalMoves(this.board)
          ];
        }
      });
    });
    return moves;
  }
}