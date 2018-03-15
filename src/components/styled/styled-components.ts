import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';

import {
  ThemeProps
} from 'components/styled/theme';

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<ThemeProps>;

export { css, injectGlobal, keyframes, ThemeProvider };
export default styled;