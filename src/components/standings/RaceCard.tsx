// Individual race result card component
// Shows race name, position, and full points breakdown

import { Box, Typography } from '@mui/material';

import type { Race } from 'src/types';
import { PODIUM_POSITIONS, POLE_POSITION } from 'src/constants';
import { POINTS_COLORS } from 'src/theme/palette';

interface RaceCardProps {
  race: Race;
  driverId: string;
  isGhost?: boolean;
}

// Get short race name
function getShortRaceName(raceName: string): string {
  return raceName
    .replace(' Grand Prix', ' GP')
    .replace('Emilia Romagna', 'Imola')
    .replace('Saudi Arabian', 'Saudi')
    .replace('United States', 'USA')
    .replace('Mexico City', 'Mexico')
    .replace('São Paulo', 'Brazil')
    .replace('Las Vegas', 'Vegas');
}

// Format position display
function formatPosition(position: number | null, status: string): string {
  if (position === null) {
    if (status === 'Retired') return 'DNF';
    if (status === 'Disqualified') return 'DSQ';
    if (status === 'Did not start') return 'DNS';
    return 'DNF';
  }
  return `P${position}`;
}

export function RaceCard({ race, driverId, isGhost = false }: RaceCardProps): React.ReactElement {
  const raceResult = race.results.find((r) => r.driverId === driverId);
  const sprintResult = race.sprint?.find((s) => s.driverId === driverId);
  const qualifyingResult = race.qualifying.find((q) => q.driverId === driverId);

  // Calculate all points in one place
  const points = {
    race: raceResult?.points ?? 0,
    sprint: sprintResult?.points ?? 0,
    pole: qualifyingResult?.position === POLE_POSITION ? 1 : 0,
    fastestLap: raceResult?.fastestLap === true ? 1 : 0,
  };
  const totalPoints = points.race + points.sprint + points.pole + points.fastestLap;
  const hasBonus = points.sprint > 0 || points.pole > 0 || points.fastestLap > 0;

  const position = raceResult?.position ?? null;
  const status = raceResult?.status ?? 'Unknown';
  const isPodium = position !== null && position <= PODIUM_POSITIONS;
  const isWin = position === POLE_POSITION;

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: isGhost ? 'transparent' : 'background.paper',
        borderRadius: 1,
        textAlign: 'center',
        border: 1,
        borderColor: isGhost ? 'divider' : isWin ? 'primary.main' : 'divider',
        borderStyle: isGhost ? 'dashed' : 'solid',
        opacity: isGhost ? 0.5 : 1,
        filter: isGhost ? 'grayscale(70%)' : 'none',
        minWidth: 75,
      }}
    >
      {/* Race name */}
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ fontSize: '0.65rem', lineHeight: 1.2, mb: 0.5 }}
      >
        {getShortRaceName(race.raceName)}
      </Typography>

      {/* Position */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: position === null ? 'text.disabled' : isPodium ? 'primary.main' : 'text.primary',
        }}
      >
        {formatPosition(position, status)}
      </Typography>

      {/* Total points */}
      <Typography variant="caption" color="text.secondary" display="block">
        {isGhost ? `(${totalPoints})` : totalPoints} pts
      </Typography>

      {/* Points breakdown - only show if there are bonus points */}
      {hasBonus && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 0.5,
            mt: 0.5,
          }}
        >
          {points.race > 0 && (
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
              R:{points.race}
            </Typography>
          )}
          {points.sprint > 0 && (
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'info.main' }}>
              S:{points.sprint}
            </Typography>
          )}
          {points.pole > 0 && (
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'warning.main' }}>
              P:1
            </Typography>
          )}
          {points.fastestLap > 0 && (
            <Typography
              variant="caption"
              sx={{ fontSize: '0.6rem', color: POINTS_COLORS.fastestLap }}
            >
              FL:1
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
