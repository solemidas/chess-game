
import Board from 'classes/Board';
import Move from 'classes/Board/Move';
export default abstract class Strategy {
  abstract execute(board: Board, depth: number): Move | null;
}