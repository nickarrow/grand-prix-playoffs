// Single driver row in the standings table

import { useState } from 'react';

import { Box, Collapse, TableCell, TableRow, Typography } from '@mui/material';
import { Trophy } from 'lucide-react';

import type { Driver, PlayoffState, PlayoffRound, Race } from 'src/types';
import { getTeamColor, PODIUM_POSITIONS } from 'src/constants';
import { PODIUM_COLORS, ELIMINATION_COLOR } from 'src/theme/palette';

import { DriverDetail } from './DriverDetail';

interface DriverRowProps {
  driver: Driver;
  position: number;
  regularSeasonPoints: number;
  playoffState: PlayoffState;
  allRaces: Race[];
}

function getRoundPoints(round: PlayoffRound | undefined, driverId: string): number | null {
  if (!round) return null;
  const standing = round.standings.find((s) => s.driver.driverId === driverId);
  return standing?.points ?? null;
}

function wasEliminatedIn(round: PlayoffRound | undefined, driverId: string): boolean {
  return round?.eliminated.includes(driverId) ?? false;
}

export function DriverRow({
  driver,
  position,
  regularSeasonPoints,
  playoffState,
  allRaces,
}: DriverRowProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  const { rounds, qualifiedDrivers, champion } = playoffState;
  const didQualify = qualifiedDrivers.includes(driver.driverId);
  const isChampion = champion === driver.driverId;
  const teamColors = getTeamColor(driver.constructorId);

  const round1 = rounds.find((r) => r.round === 1);
  const round2 = rounds.find((r) => r.round === 2);
  const round3 = rounds.find((r) => r.round === 3);
  const finalRound = rounds.find((r) => r.round === 4);

  const r1Points = didQualify ? getRoundPoints(round1, driver.driverId) : null;
  const r2Points =
    didQualify && !wasEliminatedIn(round1, driver.driverId)
      ? getRoundPoints(round2, driver.driverId)
      : null;
  const r3Points =
    didQualify &&
    !wasEliminatedIn(round1, driver.driverId) &&
    !wasEliminatedIn(round2, driver.driverId)
      ? getRoundPoints(round3, driver.driverId)
      : null;
  const finalPoints =
    didQualify &&
    !wasEliminatedIn(round1, driver.driverId) &&
    !wasEliminatedIn(round2, driver.driverId) &&
    !wasEliminatedIn(round3, driver.driverId)
      ? getRoundPoints(finalRound, driver.driverId)
      : null;

  const eliminatedR1 = wasEliminatedIn(round1, driver.driverId);
  const eliminatedR2 = wasEliminatedIn(round2, driver.driverId);
  const eliminatedR3 = wasEliminatedIn(round3, driver.driverId);
  const isEliminated = eliminatedR1 || eliminatedR2 || eliminatedR3;

  // Podium positions (1st, 2nd, 3rd in final standings)
  const isPodium = position <= PODIUM_POSITIONS && didQualify && !isEliminated;

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
      return (
        <Typography
          variant="body2"
          sx={{ textAlign: 'right', color: ELIMINATION_COLOR, fontWeight: 700 }}
        >
          ✗
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
        <TableCell sx={{ width: 36, p: 1 }}>
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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {driver.code}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              {driver.firstName} {driver.lastName}
            </Typography>
            {isChampion && <Trophy size={14} color={PODIUM_COLORS.gold} />}
            {position === 2 && isPodium && <Trophy size={14} color={PODIUM_COLORS.silver} />}
            {position === 3 && isPodium && <Trophy size={14} color={PODIUM_COLORS.bronze} />}
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
      </TableRow>

      {/* Expanded detail */}
      <TableRow>
        <TableCell
          colSpan={7}
          sx={{ p: 0, borderBottom: expanded ? 1 : 0, borderColor: 'divider' }}
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <DriverDetail
              driverId={driver.driverId}
              playoffState={playoffState}
              allRaces={allRaces}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
