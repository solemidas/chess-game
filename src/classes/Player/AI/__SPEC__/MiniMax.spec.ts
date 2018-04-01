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
      const min = miniMax.min(board, 2);
      console.log('min', min);
    });
  });
  describe('max', () => {
    it('Should return ,max value', () => {
      // console.log(board);
    });
  });
});