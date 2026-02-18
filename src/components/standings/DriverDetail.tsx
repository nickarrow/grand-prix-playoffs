// Expanded driver detail view - shows race-by-race breakdown by phase

import { Box } from '@mui/material';

import type { Race, PlayoffState } from 'src/types';
import { calculateTotalPoints } from 'src/engine';
import { getTeamColor } from 'src/constants';

import { PhaseSection } from './PhaseSection';

interface DriverDetailProps {
  driverId: string;
  constructorId: string;
  playoffState: PlayoffState;
  allRaces: Race[];
}

export function DriverDetail({
  driverId,
  constructorId,
  playoffState,
  allRaces,
}: DriverDetailProps): React.ReactElement {
  const { regularSeasonRaces: regSeasonCount, playoffStartRace, rounds } = playoffState;
  const teamColor = getTeamColor(constructorId).primary;

  const regularSeasonRaces = allRaces.filter((r) => r.round <= regSeasonCount);
  const regularSeasonPoints = calculateTotalPoints(driverId, regularSeasonRaces);

  let eliminatedInRound: number | null = null;
  for (const round of rounds) {
    if (round.eliminated.includes(driverId)) {
      eliminatedInRound = round.round;
      break;
    }
  }

  const didQualify = playoffState.qualifiedDrivers.includes(driverId);

  const getPlayoffRoundRaces = (roundNum: number): Race[] => {
    const round = rounds.find((r) => r.round === roundNum);
    if (!round) return [];
    return allRaces.filter((race) => round.raceNumbers.includes(race.round));
  };

  const getGhostRaces = (): Race[] => {
    if (!didQualify) {
      return allRaces.filter((r) => r.round >= playoffStartRace);
    }
    if (eliminatedInRound !== null) {
      const eliminationRound = rounds.find((r) => r.round === eliminatedInRound);
      if (!eliminationRound) return [];
      const lastEliminationRace = Math.max(...eliminationRound.raceNumbers);
      return allRaces.filter((r) => r.round > lastEliminationRace);
    }
    return [];
  };

  const ghostRaces = getGhostRaces();
  const ghostPoints = calculateTotalPoints(driverId, ghostRaces);

  return (
    <Box sx={{ py: 2, px: { xs: 2, sm: 4 }, bgcolor: 'action.hover' }}>
      {/* Regular Season */}
      <PhaseSection
        type="regular"
        races={regularSeasonRaces}
        driverId={driverId}
        points={regularSeasonPoints}
        accentColor={teamColor}
      />

      {/* Playoff Rounds */}
      {didQualify && (
        <>
          {rounds.map((round) => {
            const roundRaces = getPlayoffRoundRaces(round.round);
            if (roundRaces.length === 0) return null;

            const wasInRound = round.standings.some((s) => s.driver.driverId === driverId);
            if (!wasInRound) return null;

            const standing = round.standings.find((s) => s.driver.driverId === driverId);
            const roundPoints = standing?.points ?? 0;
            const wasEliminated = round.eliminated.includes(driverId);

            return (
              <PhaseSection
                key={round.round}
                type={
                  round.round === 4
                    ? 'final'
                    : (`round${round.round}` as 'round1' | 'round2' | 'round3')
                }
                races={roundRaces}
                driverId={driverId}
                points={roundPoints}
                isEliminated={wasEliminated}
                accentColor={teamColor}
              />
            );
          })}
        </>
      )}

      {/* Ghost section */}
      {ghostRaces.length > 0 && (
        <PhaseSection
          type="ghost"
          races={ghostRaces}
          driverId={driverId}
          points={ghostPoints}
          isGhost
          label={didQualify ? 'After Elimination' : 'Playoffs (Did not advance)'}
          accentColor={teamColor}
        />
      )}
    </Box>
  );
}
