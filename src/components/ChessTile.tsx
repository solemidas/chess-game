
import * as React from 'react';
import * as ChessPieces from 'components/ChessPieces';
import Tile from 'classes/Tile';
import {
  ChessTile as TileView,
} from 'components/styled';
const {
  Component,
} = React;

interface Props {
  handlePieceClick: (tile: Tile) => void;
  tile: Tile;
  coordinate: number;
}

interface State {

}

export default class ChessTile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render(): React.ReactNode {
    const {
      handlePieceClick,
      tile,
      coordinate
    } = this.props;
    const pieceOnTile = tile.getPiece();
    if (!pieceOnTile) {
      return (
      <TileView 
        black={coordinate % 2 === 0}
        highlight={tile.isHighlighted()}
        onClick={() => handlePieceClick(tile)}
      />);
    }
    let Piece = ChessPieces[pieceOnTile.getName()];
    const fill = pieceOnTile.isWhite() ? 'white' : 'black';
    Piece = Piece ? Piece.replace('stylePlaceholder', `style="fill:${fill}"`) : '';
    return(
      <TileView
        black={coordinate % 2 === 0}
        highlight={tile.isHighlighted()}
        onClick={() => handlePieceClick(tile)}
      >
        <div
          style={{
            height: '80px',
          }}
          dangerouslySetInnerHTML={{__html: Piece}}
        />
      </TileView>
    );
  }

}