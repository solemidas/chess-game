import * as React from 'react';
import ChessRules from 'classes/ChessRules';
import ChessPiece, {
  ChessPieceName,
  ChessBoardType,
  ChessPieceType,
  Position
} from 'components/ChessPiece';

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
  chessBoardElements: ChessBoardType;
  pieces: ChessPieceName [];
  moves: Position [];
  pieceToMove?: ChessPieceType;
}

export default class ChessBoard extends Component<Props, State> {
  chessBoardElements: ChessBoardType;
  chessRules: ChessRules;
  constructor(props: Props) {
    super(props);
    this.renderChessCells = this.renderChessCells.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.highlightLegalBlocks = this.highlightLegalBlocks.bind(this);
    this.clearHighlitedBlocks = this.clearHighlitedBlocks.bind(this);
    this.chessRules = new ChessRules();
    this.state = {
      chessBoardElements: this.chessRules.chessBoardElements,
      pieces: [
        'Rook',
        'Knight',
        'Bishop',
        'Queen',
        'King',
        'Bishop',
        'Knight',
        'Rook',
      ],
      moves: []
    };
  }
  componentWillMount() {
    // this.setState({
    //   chessBoardElements: this.defaultBoardElements(),
    // });
  }
  clearHighlitedBlocks() {
    const {
      chessBoardElements,
    } = this.state;
    return chessBoardElements.map((row: ChessPieceType []) => {
      return row.map((piece: ChessPieceType) => {
        piece.highlight = false;
        return piece;
      });
    });
  }
  highlightLegalBlocks(moves: Position [], pieceToMove: ChessPieceType) {
    let chessBoardElements = this.clearHighlitedBlocks();
    moves.forEach(({x, y}) => {      
      chessBoardElements[x][y].highlight = true;
    });
    this.setState({
      chessBoardElements,
      moves,
      pieceToMove,
    });
  }

  handleBoardClick(piece: ChessPieceType) {
    const {
      moves,
      pieceToMove
    } = this.state;
    if (moves.length > 0 && pieceToMove) {
      const chessBoardElements = this.chessRules.makeMove(moves, piece, pieceToMove);
      this.setState({
        chessBoardElements,
        moves: [],
        pieceToMove: undefined
      }, () => {
        let chessBoard = this.clearHighlitedBlocks();
        this.setState({
          chessBoardElements: chessBoard,
        });
      });
    } else {
      const legalMoves = this.chessRules.getLegalMoves(piece);
      this.highlightLegalBlocks(legalMoves, piece);
    }
  }
  renderChessCells() {
    const {
      chessBoardElements
    } = this.state;
    return chessBoardElements.map((row: ChessPieceType []) => {
      return row.map((piece: ChessPieceType) => {
        const { position, highlight } = piece;
        const {x, y} = position;
        return (
          <ChessCell
            black={(x + y) % 2 === 0}
            key={`${piece}-${y}${x}`}
            highlight={highlight}
          >
            <ChessPiece
              piece={piece}
              handlePieceClick={this.handleBoardClick}
            />
          </ChessCell>);
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