
import * as React from 'react';
import * as ChessPieces from 'components/ChessPieces';
const {
  Component,
} = React;
export type ChessPieceType = 'King' | 'Queen' | 'Rook' | 'Knight' | 'Pawn' | 'Bishop';

interface Props {
  color: string;
  piece: ChessPieceType;
}

interface State {

}

export default class ChessPiece extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render(): React.ReactNode {
    const {
      piece,
      color,
    } = this.props;
    const Piece = ChessPieces[piece].replace('stylePlaceholder', `style="fill:${color}"`);
    return(
      <div
        {...this.props}
        style={{
          height: '80px',
        }}
        dangerouslySetInnerHTML={{__html: Piece}}
      />
    );
  }

}