
import * as React from 'react';
import * as ChessPieces from 'components/ChessPieces';
const {
  Component,
} = React;
export type ChessPieceName = 'King' | 'Queen' | 'Rook' | 'Knight' | 'Pawn' | 'Bishop' | 'Empty';
export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  up = 1,
  down = -1
}

type ColorType = 'black' | 'white' | 'none';
export interface ChessPieceType {
  name: ChessPieceName;
  position: Position;
  inGame: boolean;
  color: ColorType;
  direction?: Direction;
  highlight?: boolean;
  moved?: boolean;
}

interface Props {
  handlePieceClick: (piece: ChessPieceType) => void;
  piece: ChessPieceType;
}

export type ChessBoardType = ChessPieceType [] [];

interface State {

}

export default class ChessPiece extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render(): React.ReactNode {
    const {
      piece: {
        name,
        color
      },
      handlePieceClick
    } = this.props;
    let Piece = ChessPieces[name];
    Piece = Piece ? Piece.replace('stylePlaceholder', `style="fill:${color}"`) : '';
    return(
      <div
        onClick={() => handlePieceClick(this.props.piece)}
        style={{
          height: '80px',
        }}
        dangerouslySetInnerHTML={{__html: Piece}}
      />
    );
  }

}