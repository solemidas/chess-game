import {
  ChessPieceName,
  ChessPieceType,
} from 'components/ChessPiece';
type Coordinates = 'x' | 'y';
import * as _ from 'lodash';
import Matrix, { Position } from 'classes/Matrix';
export default class ChessRules {
  private pieces: ChessPieceName [];
  private chessBoard: Matrix<ChessPieceType>;
  constructor() {
    this.pieces = [
      'Rook',
      'Knight',
      'Bishop',
      'Queen',
      'King',
      'Bishop',
      'Knight',
      'Rook',
    ];
    this.chessBoard = new Matrix<ChessPieceType>(8, 8);
    this.initializeBoard();
  }
  initializeBoard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let piece = this.pieces[j];
        const isPawn = i === 1 || i === 6;
        piece = isPawn ? 'Pawn' : piece;
        const direction = i === 1 ? 1 : -1;
        const color = i < 2 ? 'white' : 'black';
        let element: ChessPieceType = {
          inGame: true,
          moved: false,
          name: piece,
          direction,
          color,
        };
        if (!(i <= 1 || i >= 6)) {
          element.name = 'Empty';
          element.color = 'none';
        }
       this.chessBoard.setElement(i, j, element);
      }
    }
  }
  get chessBoardElements(): [ChessPieceType []] {
    return this.chessBoard.Matrix;
  }
  /**
   * @description searches for valid moves horizontally or vertically.
   * @param {number} position
   * @param {number} dir 
   */
  searchLegalMoves(coordinateValue: number, cord: Coordinates, otherCoordinateValue: number): Position [] {
    return [];
  }
  // getDiagonalBlockers() {
    
  // }
  getLegalPawnMoves(piece: ChessPieceType, position: Position): Position [] {
    let moves: Position [] = [];
    const pushValidMoves = (diagonals: Position []) => {
      let n = diagonals.length;
      const diagonal = diagonals[n - 1];
      const pieceAtDiagonal = diagonal ? this.chessBoard.getEelement(diagonal.row, diagonal.col) : null;
      if (pieceAtDiagonal && pieceAtDiagonal.color !== piece.color) {
        moves.push(diagonal);
      }
    };
    if (piece.direction === -1) {
      const leftDiagonals = this.chessBoard.toTopLeft(position);
      const rightDiagonals = this.chessBoard.toTopRight(position);
      pushValidMoves(leftDiagonals);
      pushValidMoves(rightDiagonals);
    } else {
      const leftDiagonals = this.chessBoard.toBottomLeft(position);
      const rightDiagonals = this.chessBoard.toBottomRight(position);
      pushValidMoves(leftDiagonals);
      pushValidMoves(rightDiagonals);
    }
    return moves;
  }
  getLegalKingMoves(piece: ChessPieceType): Position [] {
    return [];
  }
  getLegalQueenMoves(piece: ChessPieceType): Position [] {
    return [];
  }
  getLegalBishopMoves(piece: ChessPieceType): Position [] {
    return [];
  }
  getLegalKnightMoves(piece: ChessPieceType): Position [] {
    return [];
  }
  getLegalRookMoves(piece: ChessPieceType): Position [] {
    return [];
  }
  getLegalMoves(piece: ChessPieceType, position: Position): Position [] {
    switch (piece.name) {
      case 'Pawn':
          return this.getLegalPawnMoves(piece, position);
        case 'King':
          return this.getLegalKingMoves(piece);
        case 'Queen':
          return this.getLegalQueenMoves(piece);
        case 'Bishop':
          return this.getLegalBishopMoves(piece);
        case 'Knight':
          return this.getLegalKnightMoves(piece);
        case 'Rook':
          return this.getLegalRookMoves(piece);
        default:
          return [];
    }
  }
  makeMove(legalMoves: Position [], from: Position, to: Position): [ChessPieceType []] {
    const legalMove = _.find(legalMoves, ({row, col}) => {
      return row === to.row && col === to.col;
    });
    let element: ChessPieceType = {
      inGame: true,
      moved: false,
      name: 'Empty',
      direction: -1,
      color: 'none',
    };
    const piece = this.chessBoard.getEelement(from.row, from.col);
    if (legalMove && piece) {
      this.chessBoard.setElement(from.row, from.col, element);
      this.chessBoard.setElement(to.row, to.col, piece);
    }
    return this.chessBoard.Matrix;
  }
}