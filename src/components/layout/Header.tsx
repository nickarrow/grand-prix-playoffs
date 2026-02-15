import { useState } from 'react';

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useThemeStore } from 'src/store';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: '2025', path: '/2025' },
  { label: '2026', path: '/2026' },
  { label: 'About', path: '/about' },
] as const;

export function Header(): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleMode } = useThemeStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        GPP
      </Typography>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <Menu size={24} />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            Grand Prix Playoffs
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              {NAV_ITEMS.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    textDecoration: 'none',
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}

          <IconButton
            color="inherit"
            onClick={toggleMode}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
