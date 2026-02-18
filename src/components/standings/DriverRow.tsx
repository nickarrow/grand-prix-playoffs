// Single driver row in the standings table

import { useState } from 'react';

import { Box, Collapse, TableCell, TableRow, Typography } from '@mui/material';
import { ChevronRight } from 'lucide-react';

import { useTheme } from '@mui/material/styles';

import type { Driver, PlayoffState, Race } from 'src/types';
import { getTeamColor } from 'src/constants';
import { ELIMINATION_COLOR } from 'src/theme/palette';
import { getPlayoffRoundPoints, wasEliminatedInRound } from 'src/utils';

import { DriverDetail } from './DriverDetail';

const CHEVRON_ICON_SIZE = 14;
const DRIVER_CODE_WIDTH = 28;
const DRIVER_NAME_WIDTH = 120;
const F1_COLUMN_WIDTH = 40;

interface DriverRowProps {
  driver: Driver;
  position: number;
  regularSeasonPoints: number;
  officialPoints: number;
  playoffState: PlayoffState;
  allRaces: Race[];
}

export function DriverRow({
  driver,
  position,
  regularSeasonPoints,
  officialPoints,
  playoffState,
  allRaces,
}: DriverRowProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const mode = theme.palette.mode;

  const { rounds, qualifiedDrivers, champion } = playoffState;
  const didQualify = qualifiedDrivers.includes(driver.driverId);
  const isChampion = champion === driver.driverId;
  const teamColors = getTeamColor(driver.constructorId);

  const round1 = rounds.find((r) => r.round === 1);
  const round2 = rounds.find((r) => r.round === 2);
  const round3 = rounds.find((r) => r.round === 3);
  const finalRound = rounds.find((r) => r.round === 4);

  const r1Points = didQualify ? getPlayoffRoundPoints(round1, driver.driverId) : null;
  const r2Points =
    didQualify && !wasEliminatedInRound(round1, driver.driverId)
      ? getPlayoffRoundPoints(round2, driver.driverId)
      : null;
  const r3Points =
    didQualify &&
    !wasEliminatedInRound(round1, driver.driverId) &&
    !wasEliminatedInRound(round2, driver.driverId)
      ? getPlayoffRoundPoints(round3, driver.driverId)
      : null;
  const finalPoints =
    didQualify &&
    !wasEliminatedInRound(round1, driver.driverId) &&
    !wasEliminatedInRound(round2, driver.driverId) &&
    !wasEliminatedInRound(round3, driver.driverId)
      ? getPlayoffRoundPoints(finalRound, driver.driverId)
      : null;

  const eliminatedR1 = wasEliminatedInRound(round1, driver.driverId);
  const eliminatedR2 = wasEliminatedInRound(round2, driver.driverId);
  const eliminatedR3 = wasEliminatedInRound(round3, driver.driverId);

  const renderPointsCell = (
    points: number | null,
    eliminated: boolean,
    isFinal: boolean = false
  ): React.ReactNode => {
    if (points === null) {
      return (
        <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'right' }}>
          -
        </Typography>
      );
    }
    if (eliminated) {
      const eliminationColor = mode === 'dark' ? ELIMINATION_COLOR.dark : ELIMINATION_COLOR.light;
      return (
        <Typography
          variant="body2"
          sx={{
            textAlign: 'right',
            color: eliminationColor,
            fontWeight: 700,
          }}
        >
          {points}
        </Typography>
      );
    }
    return (
      <Typography variant="body2" fontWeight={isFinal && isChampion ? 700 : 400}>
        {points}
      </Typography>
    );
  };

  return (
    <>
      <TableRow
        onClick={() => setExpanded(!expanded)}
        sx={{
          cursor: 'pointer',
          // Only apply hover on devices that support it (not touch)
          '@media (hover: hover)': {
            '&:hover': { bgcolor: 'action.hover' },
          },
        }}
      >
        {/* Position */}
        <TableCell sx={{ width: 36, p: 1 }} align="right">
          <Typography variant="body2" fontWeight={600}>
            {position}
          </Typography>
        </TableCell>

        {/* Driver with team color */}
        <TableCell sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 3,
                height: 20,
                bgcolor: teamColors.primary,
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            {/* 3-letter code on mobile, full name on desktop */}
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ display: { xs: 'block', md: 'none' }, width: DRIVER_CODE_WIDTH }}
            >
              {driver.code}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ display: { xs: 'none', md: 'block' }, width: DRIVER_NAME_WIDTH }}
            >
              {driver.firstName} {driver.lastName}
            </Typography>
            <ChevronRight
              size={CHEVRON_ICON_SIZE}
              style={{
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                opacity: 0.5,
                flexShrink: 0,
              }}
            />
          </Box>
        </TableCell>

        {/* Regular season points */}
        <TableCell align="right" sx={{ p: 1 }}>
          <Typography variant="body2">{regularSeasonPoints}</Typography>
        </TableCell>

        {/* Round 1 */}
        <TableCell align="right" sx={{ p: 1 }}>
          {renderPointsCell(r1Points, eliminatedR1)}
        </TableCell>

        {/* Round 2 */}
        <TableCell align="right" sx={{ p: 1 }}>
          {renderPointsCell(r2Points, eliminatedR2)}
        </TableCell>

        {/* Round 3 */}
        <TableCell align="right" sx={{ p: 1 }}>
          {renderPointsCell(r3Points, eliminatedR3)}
        </TableCell>

        {/* Final */}
        <TableCell align="right" sx={{ p: 1 }}>
          {renderPointsCell(finalPoints, false, true)}
        </TableCell>

        {/* Official F1 Points (reference column) */}
        <TableCell
          align="center"
          sx={{
            py: 1,
            px: 0.25,
            borderLeft: 3,
            borderColor: 'divider',
            width: F1_COLUMN_WIDTH,
            minWidth: F1_COLUMN_WIDTH,
            maxWidth: F1_COLUMN_WIDTH,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic', fontSize: '0.8rem' }}
          >
            {officialPoints}
          </Typography>
        </TableCell>
      </TableRow>

      {/* Expanded detail */}
      <TableRow>
        <TableCell
          colSpan={8}
          sx={{ p: 0, borderBottom: expanded ? 1 : 0, borderColor: 'divider' }}
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <DriverDetail
              driverId={driver.driverId}
              constructorId={driver.constructorId}
              playoffState={playoffState}
              allRaces={allRaces}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
