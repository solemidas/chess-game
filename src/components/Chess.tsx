import * as React from 'react';
import Move from 'classes/Board/Move';
import Board, { BoardType } from 'classes/Board';
import Tile from 'classes/Board/Tile';
import {
  ChessGrid
} from 'components/styled';

import ChessTile from 'components/ChessTile';

const {
  Component,
} = React;

interface Props {

}

interface State {
  boardConfiguration: BoardType;
  moves: Move [];
  from?: Tile;
}

export default class ChessBoard extends Component<Props, State> {
  board: Board;
  constructor(props: Props) {
    super(props);
    this.renderChessCells = this.renderChessCells.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.highlightLegalBlocks = this.highlightLegalBlocks.bind(this);
    this.clearHighlitedBlocks = this.clearHighlitedBlocks.bind(this);
    this.board = new Board();
    this.state = {
      moves: [],
      boardConfiguration: this.board.getBoardConfiguration(),
    };
  }
  clearHighlitedBlocks(moves: Move []) {
    moves.forEach((move: Move) => {
      this.board.getTile(move.getDestination()).clearHighlight();
    });
  }
  highlightLegalBlocks(moves: Move []) {
    moves.forEach((move: Move) => {
      this.board.getTile(move.getDestination()).highlightTile();
    });
  }

  handleBoardClick(tile: Tile) {
    const {
      moves,
      from
    } = this.state;
    if (moves.length > 0 && from && tile !== from) {
      const boardConfiguration = this.board.makeMove(from, tile, moves);
      this.setState({
        boardConfiguration,
        moves: [],
        from: undefined,
      });
    } else if (tile === from) {
        this.board.clearHighlights(moves);
        this.setState({
          moves: [],
          from: undefined,
          boardConfiguration: this.board.getBoardConfiguration()
        });
    } else {
        const piece = tile.getPiece();
        if (piece && piece.color === this.board.getPlayerTurn()) {
          const legalMoves = piece.calculateLegalMoves(this.board);
          this.highlightLegalBlocks(legalMoves);
          this.setState({
            boardConfiguration: this.board.getBoardConfiguration(),
            moves: legalMoves,
            from: tile
          });
        }
    }
  }
  renderChessCells() {
    const { boardConfiguration } = this.state;
    return boardConfiguration.map((row: Tile [], i: number) => {
      return row.map((tile: Tile, j: number) => {
        return (
          <ChessTile
            key={`Piece${i}-${j}`}
            tile={tile}
            coordinate={i + j}
            handlePieceClick={this.handleBoardClick}
          />);
      });
    });

  }
  render(): React.ReactNode {
    return(
      <ChessGrid>
        {this.renderChessCells()}
      </ChessGrid>
    );
  }

}