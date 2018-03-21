export interface Position {
  row: number;
  col: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' |
  'RIGHT' | 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';

export interface Change {
  drow: number;
  dcol: number;
  isValid: (row: number, col: number) => boolean;
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
  getEelement(row: number, col: number): T  {
    return this.matrix[row][col];
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
  getDirectionChange(direction: Direction): Change {
    let drow = 0;
    let dcol = 0;
    let isValid = (row: number, col: number) => false;
    switch (direction) {
      case 'TOP_RIGHT':
        drow -= 1;
        dcol += 1;
        isValid = (row: number, col: number) => row > -1 && col < 8;
        break;
      case 'TOP_LEFT':
        drow -= 1;
        dcol -= 1;
        isValid = (row: number, col: number) => row > -1 && col > -1;
        break;
      case 'BOTTOM_RIGHT':
        drow += 1;
        dcol += 1;
        isValid = (row: number, col: number) => row < 8 && col < 8;
        break;
      case 'BOTTOM_LEFT':
        drow += 1;
        dcol -= 1;
        isValid = (row: number, col: number) => row < 8 && col > -1;
        break;
      case 'UP':
        drow -= 1;
        isValid = (row: number, col: number) => row > -1;
        break;
      case 'DOWN':
        drow += 1;
        isValid = (row: number, col: number) => row < 8;
        break;
      case 'LEFT':
        dcol -= 1;
        isValid = (row: number, col: number) => col > -1;
        break;
      case 'RIGHT':
        dcol += 1;
        isValid = (row: number, col: number) => col < 8;
        break;
      default:
        break;
    }
    return {
      drow,
      dcol,
      isValid,
    };
  }
  getDirectionMoves(position: Position, direction: Direction): Position [] {
    const moves: Position [] = [];
    const change: Change = this.getDirectionChange(direction);
    let {
      row,
      col,
    } = position;
    while (true) {
      row += change.drow;
      col += change.dcol;
      if (change.isValid(row, col)) {
        moves.push({
          row, col
        });
      } else {
        break;
      }
    }
    return moves;
  }
  toTopRight(position: Position): Position [] {
    return this.getDirectionMoves(position, 'TOP_RIGHT');
  }
  toTopLeft(position: Position): Position [] {
    return this.getDirectionMoves(position, 'TOP_LEFT');
  }
  toBottomRight(position: Position) {
    return this.getDirectionMoves(position, 'BOTTOM_RIGHT');
  }
  toBottomLeft(position: Position) {
    return this.getDirectionMoves(position, 'BOTTOM_LEFT');
  }
  getDiagonals(position: Position): Position [] {
    const moves: Position [] = [];
    return moves;
  }
  upwards(position: Position): Position [] {
    return this.getDirectionMoves(position, 'UP');
  }
  downwards(position: Position): Position [] {
    return this.getDirectionMoves(position, 'DOWN');
  }
  toRight(position: Position): Position [] {
    return this.getDirectionMoves(position, 'RIGHT');
  }
  toLeft(position: Position): Position [] {
    return this.getDirectionMoves(position, 'LEFT');
  }
}