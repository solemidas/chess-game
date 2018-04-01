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
  constructor(alliance: PlayerAlliance, playerType: PlayerType) {
    super();
    this.alliance = alliance;
    this.playerType = playerType;
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
  getKing(board: Board): Piece {
    let piece: Piece;
    board.getBoardConfiguration().toJS().forEach((row: List<Tile>) => {
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

  isInCheck(board: Board): boolean {
    const king = this.getKing(board);
    if (king) {
      const position = king.getPosition();
      let moves: List<Move> = List();
      this.getOpponent().getLegalMoves(board).toJS().forEach((move: Move) => {
        const destination = move.getDestination();
        if (position.row === destination.row && position.col === destination.col) {
          moves = moves.push(move);
        }
      });
      return moves.size > 0;
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
  getActivePieces(board: Board): Piece [] {
    const pieces: Piece [] = [];
    board.getBoardConfiguration().forEach((row: List<Tile>) => {
      row.forEach((tile: Tile) => {
        const pieceOnTile = tile.getPiece();
        if (pieceOnTile && pieceOnTile.color === this.alliance) {
          pieces.push(pieceOnTile);
        }
      });
    });
    return pieces;
  }
  getLegalMoves(board: Board): List<Move> {
    let moves: List<Move> = List();
    const activePieces = this.getActivePieces(board);
    activePieces.forEach((piece) => {
      // @ts-ignore
      moves = moves.concat(piece.calculateLegalMoves(board));
    });
    return moves;
  }
}