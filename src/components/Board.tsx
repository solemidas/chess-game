import * as React from 'react';
import ChessRules from 'classes/Rules';
import ChessPiece, {
  ChessPieceName,
  ChessBoardType,
  ChessPieceType,
} from 'components/ChessPiece';
import {
  Position
} from 'classes/Matrix';
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
  from?: Position;
  to?: Position;
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
      moves: [],
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
  highlightLegalBlocks(moves: Position [], from: Position) {
    let chessBoardElements = this.clearHighlitedBlocks();
    moves.forEach(({row, col}) => {      
      chessBoardElements[row][col].highlight = true;
    });
    this.setState({
      chessBoardElements,
      moves,
      from,
    });
  }

  handleBoardClick(piece: ChessPieceType, position: Position) {
    console.log(piece, position);
    const {
      moves,
      from
    } = this.state;
    if (moves.length > 0 && from) {
      console.log('from:', from);
      const chessBoardElements = this.chessRules.makeMove(moves, from, position);
      this.setState({
        chessBoardElements,
        moves: [],
      }, () => {
        let chessBoard = this.clearHighlitedBlocks();
        this.setState({
          chessBoardElements: chessBoard,
        });
      });
    } else {
      const legalMoves = this.chessRules.getLegalMoves(piece, position);
      this.highlightLegalBlocks(legalMoves, position);
    }
  }
  renderChessCells() {
    const {
      chessBoardElements
    } = this.state;
    return chessBoardElements.map((row: ChessPieceType [], i: number) => {
      return row.map((piece: ChessPieceType, j: number) => {
        const { highlight } = piece;
        return (
          <ChessCell
            black={(i + j) % 2 === 0}
            key={`${piece}-${j}${i}`}
            highlight={highlight}
          >
            <ChessPiece
              piece={piece}
              position={{row: i, col: j}}
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