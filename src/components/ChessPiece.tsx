
import * as React from 'react';
import * as ChessPieces from 'components/ChessPieces';
import {
  Position
} from 'classes/Matrix';
const {
  Component,
} = React;
export type ChessPieceName = 'King' | 'Queen' | 'Rook' | 'Knight' | 'Pawn' | 'Bishop' | 'Empty';

export enum Direction {
  up = 1,
  down = -1
}

type ColorType = 'black' | 'white' | 'none';
export interface ChessPieceType {
  name: ChessPieceName;
  inGame: boolean;
  color: ColorType;
  direction: Direction;
  highlight?: boolean;
  moved?: boolean;
}

interface Props {
  handlePieceClick: (piece: ChessPieceType, position: Position) => void;
  piece: ChessPieceType;
  position: Position;
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
      handlePieceClick,
      position
    } = this.props;
    let Piece = ChessPieces[name];
    const fill = color === 'black' ? color : '#e056fd';
    Piece = Piece ? Piece.replace('stylePlaceholder', `style="fill:${fill}"`) : '';
    return(
      <div
        onClick={() => handlePieceClick(this.props.piece, position)}
        style={{
          height: '80px',
        }}
        dangerouslySetInnerHTML={{__html: Piece}}
      />
    );
  }

}