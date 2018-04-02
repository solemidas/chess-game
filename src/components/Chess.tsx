import * as _ from 'lodash';
import * as React from 'react';
import Move from 'classes/Board/Move';
import Board, { BoardType } from 'classes/Board';
import Tile from 'classes/Board/Tile';
import {
  List
} from 'immutable';
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
  moves: List<Move>;
  from?: Tile;
  board: Board;
}
export default class ChessBoard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.renderChessCells = this.renderChessCells.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.highlightLegalBlocks = this.highlightLegalBlocks.bind(this);
    this.clearHighlitedBlocks = this.clearHighlitedBlocks.bind(this);
    this.keypressHandler = this.keypressHandler.bind(this);
    this.cpuPlay = this.cpuPlay.bind(this);
    this.makePlay = this.makePlay.bind(this);
    const board = new Board();
    this.state = {
      moves: List(),
      boardConfiguration: board.getBoardConfiguration(),
      board,
    };
  }
  componentWillMount() {
    addEventListener('keypress', this.keypressHandler);
    addEventListener('makeMove', this.cpuPlay);
  }
  makePlay() {
    setTimeout(() => {
      const {
        board,
      } = this.state;
      const currentPlayer = board.getCurrentPlayer();
      const move = currentPlayer.execute(board, 2);
      if (move) {
        const customEvent = new CustomEvent<Move>('makeMove', {detail: move});
        dispatchEvent(customEvent);
      }
    }, 2000);
  }
  cpuPlay(event: CustomEvent<Move>) {
    const { detail } = event;
    this.play(detail);
  }
  componentDidMount() {
    this.makePlay();
  }
  componentWillUnmount() {
    removeEventListener('keypress', this.keypressHandler);
    removeEventListener('makeMove', this.cpuPlay);
  }
  keypressHandler(event: KeyboardEvent) {
    const { board } = this.state;
    switch (event.key.toLocaleLowerCase()) {
      case 'u':
        const newBoard = board.undoMove();
        const boardConfiguration = newBoard.getBoardConfiguration();
        this.setState({
          boardConfiguration,
          board: newBoard,
          moves: List(),
          from: undefined,
        });
        break;
      default:
        break;
    }
  }
  clearHighlitedBlocks() {
    let { board, boardConfiguration } = this.state;
    boardConfiguration = board.clearHighlights(boardConfiguration);
    this.setState({
      boardConfiguration,
      board: new Board(board, boardConfiguration)
    });
  }
  highlightLegalBlocks(moves: List<Move>) {
    const { board } = this.state;
    moves.forEach((move: Move) => {
      board.getTile(move.getDestination()).highlightTile();
    });
  }
  getMove(from: Tile, to: Tile, moves: List<Move>): Move | undefined {
    const fromLocation = from.getCoordinates();
    const destination = to.getCoordinates();
    const move = _.find(moves.toJS(), (legalMove: Move) => {
      const piece = legalMove.getMovedPiece();
      const moveDestination = legalMove.getDestination();
      const moveFrom = piece.getPosition();
      return moveDestination.col === destination.col
        && moveDestination.row === destination.row
        && fromLocation.col === moveFrom.col
        && fromLocation.row === moveFrom.row;
    });
    return move;
  }
  play(move: Move) {
    const { board } = this.state;
    const moveTransition = board.makeMove(move);
    console.log('play:move', moveTransition.getToBoard().getBoardConfiguration().toJS());
    const toBoard = moveTransition.getToBoard();
    const boardConfiguration = toBoard.getBoardConfiguration();
    this.setState({
      boardConfiguration: boardConfiguration,
      moves: List(),
      from: undefined,
      board: toBoard,
    }, () => {
        this.clearHighlitedBlocks();
        const currentPlayer = this.state.board.getCurrentPlayer();
        if (currentPlayer.isCPU()) {
          this.makePlay();
        }
    });
  }
  handleBoardClick(tile: Tile) {
    const {
      moves,
      from,
      board
    } = this.state;
    if (moves.size > 0 && from && tile !== from) {
      const move = this.getMove(from, tile, moves);
      if (move) {
        this.play(move);
      }
    } else if (tile === from) {
        const boardConfiguration = board.clearHighlights(board.getBoardConfiguration());
        this.setState({
          moves: List(),
          from: undefined,
          boardConfiguration,
        });
    } else {
        const piece = tile.getPiece();
        if (piece && piece.color === board.getPlayerTurn()) {
          const legalMoves = piece.calculateLegalMoves(board);
          this.highlightLegalBlocks(legalMoves);
          this.setState({
            boardConfiguration: board.getBoardConfiguration(),
            moves: legalMoves,
            from: tile
          });
        }
    }
  }
  renderChessCells() {
    const { boardConfiguration } = this.state;
    return boardConfiguration.map((row: List<Tile>, i: number) => {
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