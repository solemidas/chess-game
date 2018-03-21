import {
  ChessPieceName,
  ChessPieceType,

} from 'components/ChessPiece';
import * as _ from 'lodash';
import Matrix, { Position, Direction, Change } from 'classes/Matrix';

type MoveType = 'CAPTURE' | 'ALLOW_BOTH' | 'NORMAL';
export default class ChessRules {
  private pieces: ChessPieceName [];
  private chessBoard: Matrix<ChessPieceType>;
  private queenDirections: Direction [];
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
    this.queenDirections = [
      'LEFT',
      'RIGHT',
      'UP',
      'DOWN',
      'TOP_LEFT',
      'TOP_RIGHT',
      'BOTTOM_LEFT',
      'BOTTOM_RIGHT'
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
    let stop = false;
    suggestedMoves.splice(blocks);
    console.log(suggestedMoves);
    suggestedMoves.forEach((move: Position, idx: number) => {
      const pieceAtPosition = this.chessBoard.getEelement(move.row, move.col);
      if (pieceAtPosition.color !== piece.color && this.allowMove(pieceAtPosition, moveType) && !stop) {
        const previousMove = moves[idx - 1];
        if (previousMove) {
          const previousPiece = this.chessBoard.getEelement(previousMove.row, previousMove.col);
          if (previousPiece.color === pieceAtPosition.color && previousPiece.color !== 'none') {
            stop = true;
          } else {
            moves.push(move);
          }
        } else {
          moves.push(move);
        }
      } else {
        stop = true;
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
  nonKnightMoves(piece: ChessPieceType, position: Position, blocks: number, directions:  Direction []): Position [] {
    let moves: Position [] = [];
    directions.forEach((direction: Direction) => {
      const movesInDirection = this.chessBoard.getDirectionMoves(position, direction);
      moves = [...moves, ...this.getValidMoves(piece, movesInDirection, blocks, 'ALLOW_BOTH')];
    });
    return moves;
  }
  getLegalKingMoves(piece: ChessPieceType, position: Position): Position [] {
    return this.nonKnightMoves(piece, position, 1, this.queenDirections);
  }
  getLegalQueenMoves(piece: ChessPieceType, position: Position): Position [] {
    return this.nonKnightMoves(piece, position, 8, this.queenDirections);
  }
  getLegalBishopMoves(piece: ChessPieceType, position: Position): Position [] {
    const directions: Direction [] = ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'];
    return this.nonKnightMoves(piece, position, 8, directions);
  }
  getLegalKnightMoves(piece: ChessPieceType, position: Position): Position [] {
    const other: Direction [] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let moves: Position [] = [];
    other.forEach((direction: Direction) => {
      this.chessBoard.getDiagonalChanges(direction).forEach((change: Change) => {
        const moveInDirection = this.chessBoard.getDirectionMoves(position, direction)[0];
        if (moveInDirection) {
          let { row, col } = moveInDirection;
          row += change.drow;
          col += change.dcol;
          const move = {
            row, col,
          };
          if (change.isValid(row, col)) {
            moves = [
              ...moves,
              ...this.getValidMoves(piece, [move], 1, 'ALLOW_BOTH'),
            ];
          }
        }
      });
    });
    return moves;
  }
  getLegalRookMoves(piece: ChessPieceType, position: Position): Position [] {
    const directions: Direction [] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return this.nonKnightMoves(piece, position, 8, directions);
  }
  getLegalMoves(piece: ChessPieceType, position: Position): Position [] {
    switch (piece.name) {
      case 'Pawn':
          return this.getLegalPawnMoves(piece, position);
        case 'King':
          return this.getLegalKingMoves(piece, position);
        case 'Queen':
          return this.getLegalQueenMoves(piece, position);
        case 'Bishop':
          return this.getLegalBishopMoves(piece, position);
        case 'Knight':
          return this.getLegalKnightMoves(piece, position);
        case 'Rook':
          return this.getLegalRookMoves(piece, position);
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