// Points calculation utilities

import {
  RACE_POINTS,
  SPRINT_POINTS,
  POLE_POSITION_POINTS,
  FASTEST_LAP_POINTS,
  RACE_POINTS_POSITIONS,
  SPRINT_POINTS_POSITIONS,
} from 'src/constants';
import type { Race } from 'src/types';

// Get points for a race position (0 if outside points)
export function getRacePoints(position: number | null): number {
  if (position === null || position < 1 || position > RACE_POINTS_POSITIONS) {
    return 0;
  }
  return RACE_POINTS[position - 1] ?? 0;
}

// Get points for a sprint position (0 if outside points)
export function getSprintPoints(position: number | null): number {
  if (position === null || position < 1 || position > SPRINT_POINTS_POSITIONS) {
    return 0;
  }
  return SPRINT_POINTS[position - 1] ?? 0;
}

// Calculate total points for a driver in a single race weekend
export function calculateRaceWeekendPoints(driverId: string, race: Race): number {
  let points = 0;

  // Race points
  const raceResult = race.results.find((r) => r.driverId === driverId);
  if (raceResult) {
    points += getRacePoints(raceResult.position);

    // Fastest lap bonus (already validated in API layer)
    if (raceResult.fastestLap) {
      points += FASTEST_LAP_POINTS;
    }
  }

  // Sprint points
  if (race.sprint) {
    const sprintResult = race.sprint.find((r) => r.driverId === driverId);
    if (sprintResult) {
      points += getSprintPoints(sprintResult.position);
    }
  }

  // Pole position bonus
  const poleDriver = race.qualifying.find((q) => q.position === 1);
  if (poleDriver?.driverId === driverId) {
    points += POLE_POSITION_POINTS;
  }

  return points;
}

// Calculate total points for a driver across multiple races
export function calculateTotalPoints(driverId: string, races: Race[]): number {
  return races.reduce((total, race) => total + calculateRaceWeekendPoints(driverId, race), 0);
}
