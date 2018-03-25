
import Strategy from 'classes/Player/AI/Strategy';
import Board from 'classes/Board/index';
import {
  TileCoordinate,
} from 'classes/index';
export default class MiniMax extends Strategy {
  constructor() {
    super();
  }
  execute(board: Board, depth: number): TileCoordinate {
    return {
      row: 0,
      col: 0
    };
  }
  evaluate(board: Board): number {
    return 0;
  }
  min(board: Board, depth: number): number {
    if (depth === 0) {
      return this.evaluate(board);
    }
    return 1;
    // let lowestSeenValue: number = Infinity;
    // const playerLegalMoves = board.getCurrentPlayer().getLegalMoves();
    // const n = playerLegalMoves.length;
    // for (let i = 0; i < n; i ++) {
    //   //
    // }
  }
}