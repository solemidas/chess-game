import MiniMax from 'classes/Player/AI/MiniMax';
import Board from 'classes/Board';

describe('MiniMax', () => {
  let miniMax: MiniMax;
  let board: Board;
  beforeEach(() => {
    miniMax = new MiniMax();
    board = new Board();
  });
  describe('min', () => {
    it('Should return min value', () => {
      console.log(miniMax);
    });
  });
  describe('max', () => {
    it('Should return ,max value', () => {
      console.log(board);
    });
  });
});