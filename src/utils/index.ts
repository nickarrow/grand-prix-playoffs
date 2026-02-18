// Utility functions for playoff state operations

import type { PlayoffState, PlayoffRound } from 'src/types';

// Get elimination round for a driver
// Returns: 0 = champion/finalist, 1-3 = eliminated in that round, -1 = didn't qualify
export function getEliminationRound(driverId: string, playoffState: PlayoffState): number {
  if (!playoffState.qualifiedDrivers.includes(driverId)) return -1;

  for (const round of playoffState.rounds) {
    if (round.eliminated.includes(driverId)) return round.round;
  }

  return 0; // Made it to final or still advancing
}

// Get points for a driver in a specific playoff round
export function getPlayoffRoundPoints(
  round: PlayoffRound | undefined,
  driverId: string
): number | null {
  if (!round) return null;
  const standing = round.standings.find((s) => s.driver.driverId === driverId);
  return standing?.points ?? null;
}

// Check if a driver was eliminated in a specific round
export function wasEliminatedInRound(round: PlayoffRound | undefined, driverId: string): boolean {
  return round?.eliminated.includes(driverId) ?? false;
}

// Get cumulative points from a starting round through the end of playoffs
// Used for ranking within elimination brackets
export function getBracketPoints(
  driverId: string,
  startRound: number,
  playoffState: PlayoffState
): number {
  let total = 0;
  for (const round of playoffState.rounds) {
    if (round.round >= startRound) {
      const points = getPlayoffRoundPoints(round, driverId);
      if (points !== null) {
        total += points;
      }
    }
  }
  return total;
}
