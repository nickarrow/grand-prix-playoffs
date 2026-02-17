// Main standings table component

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { PlayoffState, Race, DriverStanding } from 'src/types';
import { getEliminationRound, getPlayoffRoundPoints } from 'src/utils';

import { DriverRow } from './DriverRow';

interface StandingsTableProps {
  playoffState: PlayoffState;
  allRaces: Race[];
}

// Get points for a specific round (wrapper for sorting)
function getRoundPoints(driverId: string, roundNum: number, playoffState: PlayoffState): number {
  const round = playoffState.rounds.find((r) => r.round === roundNum);
  return getPlayoffRoundPoints(round, driverId) ?? 0;
}

// Sort qualified drivers by playoff progression
function sortByPlayoffProgression(
  standings: DriverStanding[],
  playoffState: PlayoffState
): DriverStanding[] {
  return [...standings].sort((a, b) => {
    const aElimRound = getEliminationRound(a.driver.driverId, playoffState);
    const bElimRound = getEliminationRound(b.driver.driverId, playoffState);

    // Champion first
    if (playoffState.champion === a.driver.driverId) return -1;
    if (playoffState.champion === b.driver.driverId) return 1;

    // Sort by elimination round (0 = finalists first, then 3, 2, 1)
    if (aElimRound !== bElimRound) {
      if (aElimRound === 0) return -1;
      if (bElimRound === 0) return 1;
      return bElimRound - aElimRound;
    }

    // Same elimination round - sort by that round's points (descending)
    if (aElimRound === 0) {
      return (
        getRoundPoints(b.driver.driverId, 4, playoffState) -
        getRoundPoints(a.driver.driverId, 4, playoffState)
      );
    }

    return (
      getRoundPoints(b.driver.driverId, aElimRound, playoffState) -
      getRoundPoints(a.driver.driverId, aElimRound, playoffState)
    );
  });
}

// Group drivers by elimination round
type GroupType = 'finalists' | 'eliminated' | 'non-qualifiers';

interface DriverGroup {
  label: string;
  drivers: DriverStanding[];
  type: GroupType;
}

// Check if a playoff round is complete (all races in that round have been run)
function isRoundComplete(playoffState: PlayoffState, roundNum: number): boolean {
  const round = playoffState.rounds.find((r) => r.round === roundNum);
  if (!round) return false;

  // A round is complete if it exists and has eliminated drivers
  // (the engine only populates eliminated array when round is complete)
  return round.eliminated.length > 0;
}

// Check if regular season is complete
function isRegularSeasonComplete(playoffState: PlayoffState): boolean {
  // Regular season is complete if we have any playoff rounds or season is done
  return playoffState.rounds.length > 0 || playoffState.status === 'completed';
}

function groupDriversByElimination(
  sortedQualifiers: DriverStanding[],
  nonQualifiers: DriverStanding[],
  playoffState: PlayoffState
): DriverGroup[] {
  const groups: DriverGroup[] = [];
  const finalists: DriverStanding[] = [];
  const eliminatedR3: DriverStanding[] = [];
  const eliminatedR2: DriverStanding[] = [];
  const eliminatedR1: DriverStanding[] = [];

  // Check which rounds are complete
  const r1Complete = isRoundComplete(playoffState, 1);
  const r2Complete = isRoundComplete(playoffState, 2);
  const r3Complete = isRoundComplete(playoffState, 3);
  const regularSeasonComplete = isRegularSeasonComplete(playoffState);

  for (const standing of sortedQualifiers) {
    const elimRound = getEliminationRound(standing.driver.driverId, playoffState);
    // Round 4 (final) eliminations and non-eliminated (0) are all finalists
    if (elimRound === 0 || elimRound === 4) finalists.push(standing);
    else if (elimRound === 3) eliminatedR3.push(standing);
    else if (elimRound === 2) eliminatedR2.push(standing);
    else if (elimRound === 1) eliminatedR1.push(standing);
  }

  // Finalists first, no banner
  if (finalists.length > 0) {
    groups.push({ label: '', drivers: finalists, type: 'finalists' });
  }

  // Only show elimination banners if that round is complete
  if (eliminatedR3.length > 0 && r3Complete) {
    groups.push({ label: 'Eliminated Round 3', drivers: eliminatedR3, type: 'eliminated' });
  } else if (eliminatedR3.length > 0) {
    // Round not complete, add to finalists group (still competing)
    groups[0]?.drivers.push(...eliminatedR3);
  }

  if (eliminatedR2.length > 0 && r2Complete) {
    groups.push({ label: 'Eliminated Round 2', drivers: eliminatedR2, type: 'eliminated' });
  } else if (eliminatedR2.length > 0) {
    groups[0]?.drivers.push(...eliminatedR2);
  }

  if (eliminatedR1.length > 0 && r1Complete) {
    groups.push({ label: 'Eliminated Round 1', drivers: eliminatedR1, type: 'eliminated' });
  } else if (eliminatedR1.length > 0) {
    groups[0]?.drivers.push(...eliminatedR1);
  }

  // Only show non-qualifiers banner after regular season is complete
  if (nonQualifiers.length > 0 && regularSeasonComplete) {
    groups.push({
      label: 'Did Not Advance to Playoffs',
      drivers: nonQualifiers,
      type: 'non-qualifiers',
    });
  } else if (nonQualifiers.length > 0) {
    // During regular season, just show all drivers without separation
    groups.push({ label: '', drivers: nonQualifiers, type: 'non-qualifiers' });
  }

  return groups;
}

interface SectionBannerProps {
  label: string;
  type: GroupType;
}

function SectionBanner({ label, type }: SectionBannerProps): React.ReactElement {
  const getBannerStyles = (): { bgcolor: string; color: string } => {
    switch (type) {
      case 'finalists':
        return { bgcolor: 'primary.main', color: 'primary.contrastText' };
      case 'eliminated':
        return { bgcolor: 'action.selected', color: 'text.secondary' };
      case 'non-qualifiers':
        return { bgcolor: 'action.disabledBackground', color: 'text.disabled' };
    }
  };

  const styles = getBannerStyles();

  return (
    <TableRow>
      <TableCell
        colSpan={7}
        sx={{
          p: 0,
          bgcolor: styles.bgcolor,
          borderBottom: 'none',
        }}
      >
        <Typography
          sx={{
            color: styles.color,
            fontWeight: 600,
            letterSpacing: 0.5,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            py: 0.5,
            px: 1.5,
          }}
        >
          {label}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function StandingsTable({
  playoffState,
  allRaces,
}: StandingsTableProps): React.ReactElement {
  const { regularSeasonStandings, qualifiedDrivers } = playoffState;

  const qualifiers = regularSeasonStandings.filter((s) =>
    qualifiedDrivers.includes(s.driver.driverId)
  );
  const nonQualifiers = regularSeasonStandings.filter(
    (s) => !qualifiedDrivers.includes(s.driver.driverId)
  );

  const sortedQualifiers = sortByPlayoffProgression(qualifiers, playoffState);
  const groups = groupDriversByElimination(sortedQualifiers, nonQualifiers, playoffState);

  let runningPosition = 0;

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: 'auto',
        maxWidth: { md: 700, lg: 800 },
        mx: 'auto',
      }}
    >
      <Table size="small" aria-label="Playoff standings">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell sx={{ width: 36, p: 1 }} align="right">
              <Typography variant="caption" fontWeight={600}>
                Pos
              </Typography>
            </TableCell>
            <TableCell sx={{ p: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                Driver
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ p: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                Reg
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ p: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                R1
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ p: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                R2
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ p: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                R3
              </Typography>
            </TableCell>
            <TableCell align="right" sx={{ p: 1 }}>
              <Typography variant="caption" fontWeight={600}>
                Final
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {groups.map((group) => {
            const rows = group.drivers.map((standing) => {
              runningPosition++;
              return (
                <DriverRow
                  key={standing.driver.driverId}
                  driver={standing.driver}
                  position={runningPosition}
                  regularSeasonPoints={standing.points}
                  playoffState={playoffState}
                  allRaces={allRaces}
                />
              );
            });

            // Skip banner for finalists (empty label)
            if (!group.label) {
              return rows;
            }

            return [
              <SectionBanner key={`banner-${group.label}`} label={group.label} type={group.type} />,
              ...rows,
            ];
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
