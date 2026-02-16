// F1 Team Colors (2025 Season)

export interface TeamColors {
  primary: string;
  secondary: string;
}

export const TEAM_COLORS: Record<string, TeamColors> = {
  red_bull: {
    primary: '#3671C6',
    secondary: '#1B3A6D',
  },
  mclaren: {
    primary: '#FF8000',
    secondary: '#47352E',
  },
  ferrari: {
    primary: '#E8002D',
    secondary: '#FFEB00',
  },
  mercedes: {
    primary: '#27F4D2',
    secondary: '#00A19C',
  },
  aston_martin: {
    primary: '#229971',
    secondary: '#04352D',
  },
  alpine: {
    primary: '#FF87BC',
    secondary: '#0093CC',
  },
  williams: {
    primary: '#64C4FF',
    secondary: '#00295D',
  },
  rb: {
    primary: '#6692FF',
    secondary: '#1B3A6D',
  },
  sauber: {
    primary: '#52E252',
    secondary: '#1E1E1E',
  },
  haas: {
    primary: '#B6BABD',
    secondary: '#E10600',
  },
} as const;

// Get team color with fallback
export function getTeamColor(constructorId: string): TeamColors {
  return TEAM_COLORS[constructorId] ?? { primary: '#666666', secondary: '#333333' };
}
