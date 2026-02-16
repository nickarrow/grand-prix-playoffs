// Color palette for Grand Prix Playoffs

// Podium trophy colors
export const PODIUM_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
} as const;

// Points breakdown colors
export const POINTS_COLORS = {
  race: 'text.secondary', // Gray - uses theme token
  sprint: 'info.main', // Blue - uses theme token
  pole: 'warning.main', // Yellow - uses theme token
  fastestLap: '#BB86FC', // Purple (F1's official fastest lap color)
} as const;

// Elimination marker color
export const ELIMINATION_COLOR = '#FF6B6B';

export const palette = {
  // Primary - Racing red
  primary: {
    main: '#E10600',
    light: '#FF3333',
    dark: '#B30500',
    contrastText: '#FFFFFF',
  },

  // Secondary - Dark charcoal
  secondary: {
    main: '#1E1E1E',
    light: '#3D3D3D',
    dark: '#0A0A0A',
    contrastText: '#FFFFFF',
  },

  // Status colors for playoff states
  success: {
    main: '#00D26A', // Advancing/qualified
    light: '#33DB88',
    dark: '#00A854',
  },

  error: {
    main: '#E10600', // Eliminated
    light: '#FF3333',
    dark: '#B30500',
  },

  warning: {
    main: '#FFB800', // At risk / bubble
    light: '#FFC933',
    dark: '#CC9300',
  },

  // Background colors
  background: {
    light: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    dark: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },

  // Text colors
  text: {
    light: {
      primary: '#1E1E1E',
      secondary: '#666666',
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
} as const;
