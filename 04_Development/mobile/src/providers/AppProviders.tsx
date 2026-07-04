import { bootstrapApp } from '@/bootstrap';
import '@/localization/i18n';

import { QueryProvider } from './QueryProvider';
import { SafeAreaProviderWrapper } from './SafeAreaProviderWrapper';
import { ThemeProvider } from './ThemeProvider';

type AppProvidersProps = {
  children: React.ReactNode;
};

bootstrapApp();

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProviderWrapper>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </SafeAreaProviderWrapper>
  );
}
