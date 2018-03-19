import ChessRules from 'classes/Rules';

describe('Chess Rules', () => {
  let chessRules: ChessRules;
  beforeAll((done) => {
    chessRules = new ChessRules();
    done();
  });
  describe('Search Legals moves', () => {
    it('Should return legal vertical moves', () => {
      const moves = chessRules.searchLegalMoves(4, 'x', 3);
      console.log(moves);
      expect(moves).toHaveLength(6);
    });
  });
});