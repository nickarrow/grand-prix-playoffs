// Phase section component - groups race cards under a phase header

import { useState } from 'react';

import { Box, Collapse, Paper, Typography } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

import type { Race } from 'src/types';
import { ELIMINATION_COLOR } from 'src/theme/palette';

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
  accentColor?: string;
}

const CHEVRON_ICON_SIZE = 16;
const ACCENT_BORDER_WIDTH = 3;

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
  accentColor,
}: PhaseSectionProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const eliminationColor = mode === 'dark' ? ELIMINATION_COLOR.dark : ELIMINATION_COLOR.light;
  const phaseLabel = getPhaseLabel(type, label);

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 1,
        overflow: 'hidden',
        borderLeft: accentColor ? `${ACCENT_BORDER_WIDTH}px solid ${accentColor}` : undefined,
        opacity: isGhost ? 0.7 : 1,
      }}
    >
      {/* Phase header - clickable to expand/collapse */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          p: 1.5,
          bgcolor: 'background.paper',
          // Only apply hover on devices that support it (not touch)
          '@media (hover: hover)': {
            '&:hover': { bgcolor: 'action.hover' },
          },
        }}
      >
        <ChevronRight
          size={CHEVRON_ICON_SIZE}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: isGhost ? 0.5 : 0.7,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontStyle: isGhost ? 'italic' : 'normal',
            color: isGhost ? 'text.secondary' : 'text.primary',
            flex: 1,
          }}
        >
          {phaseLabel}
        </Typography>
        {isEliminated && (
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: eliminationColor }}>
            Eliminated
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isEliminated ? eliminationColor : 'text.secondary',
            opacity: isGhost ? 0.7 : 1,
            fontStyle: isGhost ? 'italic' : 'normal',
          }}
        >
          {points} pts
        </Typography>
      </Box>

      {/* Collapsible race cards grid */}
      <Collapse in={expanded} timeout="auto">
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'background.paper',
          }}
        >
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
              Would have scored: {points} pts
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
