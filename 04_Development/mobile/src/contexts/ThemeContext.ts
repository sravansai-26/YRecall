import { createContext, useContext } from 'react';

import { theme, type Theme } from '@/theme';

const ThemeContext = createContext<Theme>(theme);

export function useThemeContext(): Theme {
  return useContext(ThemeContext);
}

export { ThemeContext };
