import {
  ChessPieceName,
  ChessPieceType,
} from 'components/ChessPiece';
import * as _ from 'lodash';
import Matrix, { Position, Direction } from 'classes/Matrix';

type MoveType = 'CAPTURE' | 'ALLOW_BOTH' | 'NORMAL';
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
  allowMove(cell: ChessPieceType, moveType: MoveType): boolean {
    switch (moveType) {
      case 'CAPTURE':
      return cell.color !== 'none';
      case 'NORMAL':
        return cell.color === 'none';
      default:
        return true;
    }
  }
  getValidMoves(piece: ChessPieceType, suggestedMoves: Position [], blocks: number, moveType: MoveType) {
    let moves: Position [] = [];
    
    suggestedMoves.splice(blocks);
    console.log(suggestedMoves);
    suggestedMoves.forEach((move: Position) => {
      const pieceAtPosition = this.chessBoard.getEelement(move.row, move.col);
      if (pieceAtPosition.color !== piece.color && this.allowMove(pieceAtPosition, moveType)) {
        moves.push(move);
      }
    });
    return moves;
  }
  getLegalPawnMoves(piece: ChessPieceType, position: Position): Position [] {
    let diagonalMoves: Position [] = [];
    let verticalMoves: Position [] = [];
    const diagonalDirections: Direction [] = 
      piece.direction === -1 ?
      ['TOP_LEFT', 'TOP_RIGHT'] :
      ['BOTTOM_LEFT', 'BOTTOM_RIGHT'];
    diagonalDirections.forEach((direction: Direction) => {
      const diagonals = this.chessBoard.getDirectionMoves(position, direction);
      diagonalMoves = [...diagonalMoves, ...this.getValidMoves(piece, diagonals, 1, 'CAPTURE')];
    });
    const verticalDirection: Direction = 
      piece.direction === -1 ? 'UP' : 'DOWN';
    const blocks = piece.moved ? 1 : 2;
    let verticals = this.chessBoard.getDirectionMoves(position, verticalDirection);
    verticalMoves = this.getValidMoves(piece, verticals, blocks, 'NORMAL');
    return [
      ...diagonalMoves,
      ...verticalMoves
    ];
  }
  getLegalKingMoves(piece: ChessPieceType, position: Position): Position [] {
    let diagonalMoves: Position [] = [];
    let verticalMoves: Position [] = [];
    const diagonalDirections: Direction [] = 
      piece.direction === -1 ?
      ['TOP_LEFT', 'TOP_RIGHT'] :
      ['BOTTOM_LEFT', 'BOTTOM_RIGHT'];
    diagonalDirections.forEach((direction: Direction) => {
      const diagonals = this.chessBoard.getDirectionMoves(position, direction);
      diagonalMoves = [...diagonalMoves, ...this.getValidMoves(piece, diagonals, 1, 'CAPTURE')];
    });
    const verticalDirection: Direction = 
      piece.direction === -1 ? 'UP' : 'DOWN';
    const blocks = piece.moved ? 1 : 2;
    let verticals = this.chessBoard.getDirectionMoves(position, verticalDirection);
    verticalMoves = this.getValidMoves(piece, verticals, blocks, 'NORMAL');
    return [
      ...diagonalMoves,
      ...verticalMoves
    ];
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
          return this.getLegalKingMoves(piece, position);
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
      piece.moved = true;
      this.chessBoard.setElement(from.row, from.col, element);
      this.chessBoard.setElement(to.row, to.col, piece);
    }
    return this.chessBoard.Matrix;
  }
}