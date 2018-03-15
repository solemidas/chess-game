import styled from 'components/styled/styled-components';
import {
  rem,
} from 'polished';
import {
  cloud,
  midnightBlue,
} from 'constants/colors';

import {
  cellHeight,
  cellWidth,
} from 'constants/sizes';
export interface CellProps {
  black?: boolean;
}

export const ChessGrid = styled.div`
  margin: 0 auto;
  width: 640px;
  height: 640px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`;

export const ChessCell = styled.div`
  background-color: ${(props: CellProps) => props.black ? midnightBlue : cloud};
  height: ${rem(cellHeight)};
  width: ${rem(cellWidth)};
`;