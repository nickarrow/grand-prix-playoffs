import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Footer } from './Footer';

export function Layout(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
