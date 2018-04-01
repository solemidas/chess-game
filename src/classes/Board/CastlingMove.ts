import Move from 'classes/Board/Move';
import King from 'classes/Piece/King';
import Board from 'classes/Board';
import { EmptyTile } from 'classes/Board/Tile';

import MoveTransition from 'classes/Board/MoveTransition';

export default class CastlingMove extends Move {
  private dy: number;
  constructor(piece: King, dy: number) {
    const destination =  {row: 0, col: 0};
    super(piece, destination, new EmptyTile(destination));
    this.dy = dy;
  }
  execute(oldBoard: Board): MoveTransition {
    const board: Board = Object.create(oldBoard);
    const pos = {col: 0, row: 0};
    const tile = board.getTile(pos);
    // @ts-ignore
    const king: King = this.getMovedPiece();
    const move = new Move(king, pos, tile);
    let configuration = board.getBoardConfiguration();
    configuration = king.castle(configuration, board, this.dy);
    const moveTransition = new MoveTransition(oldBoard, new Board(board, configuration), move);
    return moveTransition;
  }
}