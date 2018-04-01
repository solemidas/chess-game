
import Board from 'classes/Board';

export interface BoardEvaluator {
  (board: Board): number;
}