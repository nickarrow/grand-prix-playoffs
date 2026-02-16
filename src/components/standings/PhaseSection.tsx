// Phase section component - groups race cards under a phase header

import { Box, Typography } from '@mui/material';

import type { Race } from 'src/types';

import { RaceCard } from './RaceCard';

type PhaseType = 'regular' | 'round1' | 'round2' | 'round3' | 'final' | 'ghost';

interface PhaseSectionProps {
  type: PhaseType;
  races: Race[];
  driverId: string;
  points: number;
  isEliminated?: boolean;
  isGhost?: boolean;
  label?: string;
}

function getPhaseLabel(type: PhaseType, label?: string): string {
  if (label) return label;
  switch (type) {
    case 'regular':
      return 'Regular Season';
    case 'round1':
      return 'Round 1';
    case 'round2':
      return 'Round 2';
    case 'round3':
      return 'Round 3';
    case 'final':
      return 'Championship Final';
    case 'ghost':
      return 'After Elimination';
    default:
      return '';
  }
}

export function PhaseSection({
  type,
  races,
  driverId,
  points,
  isEliminated = false,
  isGhost = false,
  label,
}: PhaseSectionProps): React.ReactElement {
  const phaseLabel = getPhaseLabel(type, label);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Phase header */}
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          fontStyle: isGhost ? 'italic' : 'normal',
          color: isGhost ? 'text.secondary' : 'text.primary',
          opacity: isGhost ? 0.7 : 1,
        }}
      >
        {phaseLabel}
        {!isGhost && ` (${points} pts)`}
        {isEliminated && (
          <Typography component="span" color="error.main" sx={{ ml: 1, fontWeight: 600 }}>
            ❌ Eliminated
          </Typography>
        )}
      </Typography>

      {/* Race cards grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 1,
        }}
      >
        {races.map((race) => (
          <RaceCard key={race.round} race={race} driverId={driverId} isGhost={isGhost} />
        ))}
      </Box>

      {/* Ghost total */}
      {isGhost && points > 0 && (
        <Typography
          variant="caption"
          sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 1, display: 'block' }}
        >
          Would have scored: ({points} pts)
        </Typography>
      )}
    </Box>
  );
}
