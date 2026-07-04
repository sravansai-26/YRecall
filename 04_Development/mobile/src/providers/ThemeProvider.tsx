import type { ReactNode } from 'react';

import { ThemeContext } from '@/contexts/ThemeContext';
import { theme } from '@/theme';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
