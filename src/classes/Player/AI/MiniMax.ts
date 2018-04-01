
import Strategy from 'classes/Player/AI/Strategy';
import { BoardEvaluator } from 'classes/Player/AI/BoardEvaluator';
import Board from 'classes/Board';
import Move from 'classes/Board/Move';
import MoveTransition from 'classes/Board/MoveTransition';
export default class MiniMax extends Strategy {
  private boardEvaluator: BoardEvaluator;
  constructor() {
    super();
    this.boardEvaluator = (board: Board) => board.getBoardValue();
  }
  execute(board: Board, depth: number): Move | null {
    let bestMove: Move;
    let currentValue: number;
    let lowestSeenValue: number = Infinity;
    let highestSeenValue: number = -Infinity;
    const currentPlayer = board.getCurrentPlayer();
    currentPlayer.getLegalMoves(board).forEach((move: Move) => {
      const moveTransition: MoveTransition = board.makeMove(move);
      if (moveTransition && moveTransition.moveIsDone()) {
        currentValue = currentPlayer.isWhite() ?
          this.max(moveTransition.getToBoard(), depth - 1) :
          this.min(moveTransition.getToBoard(), depth - 1);
        if (currentPlayer.isWhite() && currentValue >= highestSeenValue) {
          highestSeenValue = currentValue;
          bestMove = move;
        } else if (!currentPlayer.isWhite() && currentValue <= lowestSeenValue) {
          lowestSeenValue = currentValue;
          bestMove = move;
        }
      }
    });
    // @ts-ignore
    return bestMove;
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
    currentPlayer.getLegalMoves(board).forEach((move: Move) => {
      const moveTransition: MoveTransition = board.makeMove(move);
      if (moveTransition && moveTransition.moveIsDone()) {
        const currentValue = this.min(moveTransition.getToBoard(), depth - 1);
        highestSeenValue = currentValue >= highestSeenValue ? currentValue : highestSeenValue;
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
    currentPlayer.getLegalMoves(board).forEach((move: Move) => {
      const moveTransition: MoveTransition = board.makeMove(move);
      if (moveTransition && moveTransition.moveIsDone()) {
        const currentValue = this.max(moveTransition.getToBoard(), depth - 1);
        lowestSeenValue = currentValue <= lowestSeenValue ? currentValue : lowestSeenValue;
      }
    });
    return lowestSeenValue;
  }
}