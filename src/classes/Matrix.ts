export interface Position {
  row: number;
  col: number;
}
export default class Matrix<T> {
  private n: number;
  private m: number;
  private matrix: [T []];
  constructor(n: number, m: number) {
    this.n = n;
    this.m = m;
    this.matrix = this.initializematrix();
  }
  initializematrix(): [T []] {
    const matrix = [];
    for (let i = 0 ; i < this.n ; i ++ ) {
      const row = [];
      for (let j = 0 ; j < this.m ; j ++ ) {
        row.push(null);
      }
      matrix.push(row);
    }
    // @ts-ignore
    return matrix;
  }
  getEelement(row: number, col: number): T | null {
    if (row > -1 && row < 8 && col > -1 && col < 8) {
      return this.matrix[row][col];
    }
    return null;
  }
  /**
   * @description Sets value at position (row, col)
   * @param {number} row 
   * @param {number} col 
   * @param {T} value
   */
  setElement(row: number, col: number, value?: T) {
    if (row < this.n && col < this.m) {
      // @ts-ignore
      this.matrix[row][col] = value;
      return 1;
    }
    return 0;
  }
  
  get Matrix(): [T []] {
    return this.matrix;
  }
  toTopRight(position: Position): Position [] {
    const moves: Position [] = [];
    let {
      row,
      col,
    } = position;
    while (true) {
      row -= 1;
      col += 1;
      if ((row < 8 && col > -1) && this.matrix[row] && !this.matrix[row][col]) {
        moves.push({
          row, col
        });
      } else {
        if (this.matrix[row] && this.matrix[row][col]) {
          moves.push({
            row, col
          });
        }
        break;
      }
    }
    return moves;
  }
  toTopLeft(position: Position): Position [] {
    const moves: Position [] = [];
    let {
      row,
      col,
    } = position;
    while (true) {
      row -= 1;
      col -= 1;
      if ((row > -1 && col > -1) && this.matrix[row] && !this.matrix[row][col]) {
        moves.push({
          row, col
        });
      } else {
        if (this.matrix[row] && this.matrix[row][col]) {
          moves.push({
            row, col
          });
        }
        break;
      }
    }
    return moves;
  }
  toBottomRight(position: Position) {
    const moves: Position [] = [];
    let {
      row,
      col,
    } = position;
    while (true) {
      row += 1;
      col += 1;
      if ((row < 8 && col < 8) && this.matrix[row] && !this.matrix[row][col]) {
        moves.push({
          row, col
        });
      } else {
        if (this.matrix[row] && this.matrix[row][col]) {
          moves.push({
            row, col
          });
        }
        break;
      }
    }
    return moves;
  }
  toBottomLeft(position: Position) {
    const moves: Position [] = [];
    let {
      row,
      col,
    } = position;
    while (true) {
      row += 1;
      col -= 1;
      if ((row < 8 && col > -1) && this.matrix[row] && !this.matrix[row][col]) {
        moves.push({
          row, col
        });
      } else {
        if (this.matrix[row] && this.matrix[row][col]) {
          moves.push({
            row, col
          });
        }
        break;
      }
    }
    return moves;
  }
  getDiagonals(position: Position): Position [] {
    const moves: Position [] = [];
    return moves;
  }
  getVerticals(position: Position): Position [] {
    const moves: Position [] = [];
    return moves;
  }
  getHorizontals(position: Position): Position [] {
    const moves: Position [] = [];
    return moves;
  }
}