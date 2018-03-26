
import Board from 'classes/Board/index';
import {
  TileCoordinate,
} from 'classes/index';
export default abstract class Strategy {
  abstract execute(board: Board, depth: number): TileCoordinate;
}