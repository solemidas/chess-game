
import Strategy from 'classes/Player/AI/Strategy';
import { BoardEvaluator } from 'classes/Player/AI/BoardEvaluator';
import Board from 'classes/Board';
import Move from 'classes/Board/Move';
import MoveTransition from 'classes/Board/MoveTransition';
import {
  TileCoordinate,
} from 'classes/index';
export default class MiniMax extends Strategy {
  private boardEvaluator: BoardEvaluator;
  constructor() {
    super();
    this.boardEvaluator = (board: Board) => board.getBoardValue();
  }
  execute(board: Board, depth: number): TileCoordinate {
    return {
      row: 0,
      col: 0
    };
  }
  evaluate(board: Board): number {
    return this.boardEvaluator(board);
  }
  max(board: Board, depth: number): number {
    if (depth === 0) {
      return this.evaluate(board);
    }
    let highestSeenValue: number = -Infinity;
    const currentPlayer = board.getCurrentPlayer();
    currentPlayer.getLegalMoves().forEach((move: Move) => {
      const destination = board.getTile(move.getDestination());
      const from = board.getTile(move.getPiecePosition());
      const moveTransition: MoveTransition = board.makeMove(from, destination, [move]);
      if (moveTransition && moveTransition.moveIsDone()) {
        const currentValue = this.min(moveTransition.getToBoard(), depth - 1);
        highestSeenValue = currentValue >= highestSeenValue ? currentValue : highestSeenValue;
      } else {
        board.undoMove();
      }
    });
    return highestSeenValue;
  }
  min(board: Board, depth: number): number {
    if (depth === 0) {
      return this.evaluate(board);
    }
    let lowestSeenValue: number = Infinity;
    const currentPlayer = board.getCurrentPlayer();
    currentPlayer.getLegalMoves().forEach((move: Move) => {
      const destination = board.getTile(move.getDestination());
      const from = board.getTile(move.getPiecePosition());
      const moveTransition: MoveTransition = board.makeMove(from, destination, [move]);
      if (moveTransition && moveTransition.moveIsDone()) {
        const currentValue = this.max(moveTransition.getToBoard(), depth - 1);
        lowestSeenValue = currentValue <= lowestSeenValue ? currentValue : lowestSeenValue;
      } else {
        board.undoMove();
      }
    });
    return lowestSeenValue;
  }
}