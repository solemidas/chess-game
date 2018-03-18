import {
  ChessPieceName,
  ChessBoardType,
  ChessPieceType,
  Position
} from 'components/ChessPiece';

import * as _ from 'lodash';
export default class ChessRules {
  private pieces: ChessPieceName [];
  private chessBoard: ChessBoardType;
  static swapCoordinates(move: Position): Position {
    return {
      x: move.y,
      y: move.x,
    };
  }
  static swapMultipleCoordinates(moves: Position []): Position [] {
    return moves.map((move: Position) => {
      return ChessRules.swapCoordinates(move);
    });
  }
  static removeOutOfBoundaryMoves(moves: Position []): Position [] {
    return moves.reduce((memo: Position [], move: Position) => {
      const legalMoves = memo;
      if (move.x > -1 && move.x < 8 && move.y < 8 && move.y > -1 ) {
        legalMoves.push(move);
      }
      return legalMoves;
    }, []);
  }
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
    this.chessBoard = this.initializeBoard();
  }
  initializeBoard(): ChessBoardType {
    const chessBoardElements: ChessBoardType = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
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
          color,
          position: {
            x: j,
            y: i,
          },
        };
        if (isPawn) {
          element.direction = direction;
        }
        if (!(i <= 1 || i >= 6)) {
          element.name = 'Empty';
          element.color = 'none';
        }
        row.push(element);
      }
      chessBoardElements.push(row);
    }
    return chessBoardElements;
  }
  get chessBoardElements(): ChessBoardType {
    return this.chessBoard;
  }

  getLegalPawnMoves(piece: ChessPieceType): Position [] {
    const fowardMoves: Position [] = [];
    const diagonalMoves: Position [] = [];
    const {
      direction,
      position,
      moved,
    } = piece;
    if (direction) {
      const { x, y } = position;
      console.log('position', position);
      const dy = y + direction;
      diagonalMoves.push({ y: dy, x: x + 1});
      diagonalMoves.push({ y: dy, x: x - 1});
      fowardMoves.push({x, y: dy});
      if (!moved) {
        fowardMoves.push({x, y: dy + direction});
      }
    }
    const inBoundaryForwardMoves = ChessRules.removeOutOfBoundaryMoves(fowardMoves);
    const inBoundaryDiagonalMoves = ChessRules.removeOutOfBoundaryMoves(diagonalMoves);
    const cleanInBoundaryDiagonal = ChessRules.swapMultipleCoordinates(inBoundaryDiagonalMoves);
    const legalDiagonalMoves = cleanInBoundaryDiagonal.reduce((memo: Position [], move: Position) => {
      const pieceInPostition: ChessPieceType = this.chessBoard[move.x][move.y];
      if (pieceInPostition.name !== 'Empty' && piece.color !== 'none' && pieceInPostition.color !== piece.color) {
        memo.push(move);
      }
      return memo;
    }, []);
    const cleanInBoundaryForward = ChessRules.swapMultipleCoordinates(inBoundaryForwardMoves);
    const legalForwardMoves = cleanInBoundaryForward.reduce((memo: Position [], move: Position, idx: number) => {
      const pieceInPostition: ChessPieceType = this.chessBoard[move.x][move.y];
      if (pieceInPostition.name === 'Empty') {
        memo.push(move);
      }
      return memo;
    }, []);
    console.log('legalForwardMoves', legalForwardMoves);
    return [
      ...legalForwardMoves,
      ...legalDiagonalMoves
    ];
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
  getLegalMoves(piece: ChessPieceType): Position [] {
    switch (piece.name) {
      case 'Pawn':
          return this.getLegalPawnMoves(piece);
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
          console.log(piece);
          return [];
    }
  }
  makeMove(legalMoves: Position [], piece: ChessPieceType, pieceToMove: ChessPieceType): ChessBoardType {
    const {
      position
    } = piece;
    let moveTo = _.find(legalMoves, (legalMove: Position) => {
      return position.x === legalMove.y && position.y === legalMove.x;
    });
    if (moveTo) {
      moveTo = ChessRules.swapCoordinates(moveTo);
      const newPiece = {
        ...pieceToMove,
        position: {
          ...moveTo
        },
      };
      const chessBoardElements = [...this.chessBoardElements];
      const {
        position: {
          x,
          y
        }
      } = pieceToMove;
      chessBoardElements[moveTo.y][moveTo.x] = newPiece;
      chessBoardElements[moveTo.y][moveTo.x].moved = true;
      chessBoardElements[y][x].name = 'Empty';
      this.chessBoard = chessBoardElements;
    }
    return this.chessBoard;
  }
}