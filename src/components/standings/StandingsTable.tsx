// Main standings table component

import {
  Box,
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
import { PLAYOFF_QUALIFIERS } from 'src/constants';
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
    // Lower elimination round = eliminated later = better position
    if (aElimRound !== bElimRound) {
      // Finalists (0) come first
      if (aElimRound === 0) return -1;
      if (bElimRound === 0) return 1;
      // Higher elimination round = eliminated later = better (R3 > R2 > R1)
      return bElimRound - aElimRound;
    }

    // Same elimination round - sort by that round's points (descending)
    if (aElimRound === 0) {
      // Finalists - sort by final points
      return (
        getRoundPoints(b.driver.driverId, 4, playoffState) -
        getRoundPoints(a.driver.driverId, 4, playoffState)
      );
    }

    // Eliminated in same round - sort by that round's points
    return (
      getRoundPoints(b.driver.driverId, aElimRound, playoffState) -
      getRoundPoints(a.driver.driverId, aElimRound, playoffState)
    );
  });
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

  // Sort qualifiers by playoff progression
  const sortedQualifiers = sortByPlayoffProgression(qualifiers, playoffState);

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
            <TableCell sx={{ width: 36, p: 1 }}>
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
          {/* Qualified drivers - sorted by playoff progression */}
          {sortedQualifiers.map((standing, idx) => (
            <DriverRow
              key={standing.driver.driverId}
              driver={standing.driver}
              position={idx + 1}
              regularSeasonPoints={standing.points}
              playoffState={playoffState}
              allRaces={allRaces}
            />
          ))}

          {/* Did Not Advance to Playoffs banner */}
          {nonQualifiers.length > 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                sx={{
                  p: 0,
                  bgcolor: 'warning.dark',
                  height: 20,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'warning.contrastText',
                      fontWeight: 700,
                      letterSpacing: 1,
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      fontStyle: 'italic',
                    }}
                  >
                    Did Not Advance to Playoffs
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {/* Non-qualified drivers - sorted by regular season points */}
          {nonQualifiers.map((standing, idx) => (
            <DriverRow
              key={standing.driver.driverId}
              driver={standing.driver}
              position={PLAYOFF_QUALIFIERS + idx + 1}
              regularSeasonPoints={standing.points}
              playoffState={playoffState}
              allRaces={allRaces}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
