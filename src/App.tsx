import { useMemo } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { CACHE_STALE_TIME, CACHE_GC_TIME } from 'src/constants';
import { router } from 'src/router';
import { useThemeStore } from 'src/store';
import { lightTheme, darkTheme } from 'src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_STALE_TIME,
      gcTime: CACHE_GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App(): JSX.Element {
  const { mode } = useThemeStore();

  const theme = useMemo(() => {
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
