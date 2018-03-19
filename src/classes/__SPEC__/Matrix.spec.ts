import Matrix from 'classes/Matrix';

describe.only('Matrix', () => {
  let matrix: Matrix<number>;
  beforeAll((done) => {
    matrix = new Matrix(8, 8);
    done();
  });
  describe('Search Diagonals', () => {
    describe('All Diagonals', () => {
      it('Should return all diagonals for provided position', () => {
        const diagonals = matrix.getDiagonals({row: 4, col: 3});
        expect(diagonals).toHaveLength(0);
      });
    });
    describe('To top right diagonals', () => {
      it('Should return all diagonals for provided position', () => {
        matrix.setElement(0, 7, 1);
        const diagonals = matrix.toTopRight({row: 4, col: 3});
        expect(diagonals).toHaveLength(4);
      });
    });
    describe('To top left diagonals', () => {
      it('Should return all diagonals for provided position', () => {
        const diagonals = matrix.getDiagonals({row: 4, col: 3});
        expect(diagonals).toHaveLength(0);
      });
    });
    describe('To bottom right diagonals', () => {
      it('Should return all diagonals for provided position', () => {
        const diagonals = matrix.getDiagonals({row: 4, col: 3});
        expect(diagonals).toHaveLength(0);
      });
    });
    describe('To bottom left diagonals', () => {
      it('Should return all diagonals for provided position', () => {
        const diagonals = matrix.getDiagonals({row: 4, col: 3});
        expect(diagonals).toHaveLength(0);
      });
    });
  });
});