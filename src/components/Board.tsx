import * as React from 'react';
import ChessPiece, { ChessPieceType } from 'components/ChessPiece';
import {
  ChessGrid,
  ChessCell,
} from 'components/styled';

const {
  Component,
} = React;
interface Props {

}

interface State {

}

export default class ChessBoard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  renderChessCells() {
    const pieces: ChessPieceType [] = [
      'Rook',
      'Knight',
      'Bishop',
      'Queen',
      'King',
      'Bishop',
      'Knight',
      'Rook',
    ];
    const cells: React.ReactNode [] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        console.log(i);
        const color = i < 2 ? 'white' : 'black';
        let piece = pieces[j];
        piece = i === 1 || i === 6 ? 'Pawn' : piece;
        if (i > 1 && i < 6) {
          cells.push(
            <ChessCell
              black={(i + j) % 2 === 0}
              key={`${piece}-${j}${i}`}
            />);
        } else {
          cells.push(
            <ChessCell
              black={(i + j) % 2 === 0}
              key={`${piece}-${j}${i}`}
            >
              <ChessPiece
                piece={piece}
                color={color}
              />
            </ChessCell>
          );
        }
      }
    }
    return cells;
  }
  render(): React.ReactNode {
    return(
      <ChessGrid>
        {this.renderChessCells()}
      </ChessGrid>
    );
  }

}