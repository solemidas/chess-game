import Board from 'classes/Board';
import Move from 'classes/Board/Move';

export default class MoveTransition {
  private fromBoard: Board;
  private toBoard: Board ;
  private transitionMove: Move;
  constructor(fromBoard: Board, toBoard: Board, move: Move) {
    this.fromBoard = fromBoard;
    this.toBoard = toBoard;
    this.transitionMove = move;
    toBoard.setPreviousTransition(this);
  }

  getFromBoard(): Board {
    return this.fromBoard;
  }

  getToBoard(): Board {
    return this.toBoard;
  }
  getTransitionMove() {
    return this.transitionMove;
  }

  moveIsDone(): boolean {
    return !this.toBoard.getCurrentPlayer().getOpponent().isInCheck();
  }

}