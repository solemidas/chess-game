import styled from 'components/styled/styled-components';
import {
  rem,
} from 'polished';
import {
  cloud,
  midnightBlue,
  turbo,
} from 'constants/colors';

import {
  cellHeight,
  cellWidth,
} from 'constants/sizes';
export interface CellProps {
  black?: boolean;
  highlight?: boolean;
}

export const ChessGrid = styled.div`
  margin: 0 auto;
  width: 640px;
  height: 640px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`;

export const ChessTile = styled.div`
  background-color: ${(props: CellProps) => {
    const {
      black,
    } = props;
    const color = black ? midnightBlue : cloud;
    return color;
  }};
  height: ${rem(cellHeight)};
  width: ${rem(cellWidth)};
  -webkit-box-shadow: ${(props: CellProps) => {
    return props.highlight ? `inset 0 0 60px ${turbo}` : 'none';
  }};
`;