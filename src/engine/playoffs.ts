// Playoff calculation engine

import { PLAYOFF_RACES, PLAYOFF_QUALIFIERS, PLAYOFF_ROUNDS } from 'src/constants';
import type {
  Race,
  RaceCalendar,
  Driver,
  PlayoffRound,
  PlayoffState,
  SeasonStatus,
} from 'src/types';

import { extractDrivers, calculateStandings } from './standings';

// Determine season status based on completed races and calendar
export function determineSeasonStatus(
  calendar: RaceCalendar[],
  completedRaces: number,
  currentDate: Date = new Date()
): SeasonStatus {
  if (calendar.length === 0) {
    return 'pre-season';
  }

  const totalRaces = calendar.length;
  const firstRaceDate = new Date(calendar[0]?.date ?? '');
  const playoffStartRace = totalRaces - PLAYOFF_RACES + 1;

  // Before first race
  if (currentDate < firstRaceDate) {
    return 'pre-season';
  }

  // After last race and all races completed
  if (completedRaces >= totalRaces) {
    return 'completed';
  }

  // In playoffs (completed races >= playoff start race)
  if (completedRaces >= playoffStartRace) {
    return 'playoffs';
  }

  return 'regular-season';
}

// Get races for regular season
export function getRegularSeasonRaces(races: Race[], totalRaces: number): Race[] {
  const regularSeasonEnd = totalRaces - PLAYOFF_RACES;
  return races.filter((race) => race.round <= regularSeasonEnd);
}

// Get races for a specific playoff round
export function getPlayoffRoundRaces(
  races: Race[],
  totalRaces: number,
  playoffRound: number
): Race[] {
  const playoffStartRace = totalRaces - PLAYOFF_RACES + 1;

  // Calculate which race numbers belong to this playoff round
  let raceOffset = 0;
  for (let i = 0; i < playoffRound - 1; i++) {
    raceOffset += PLAYOFF_ROUNDS[i]?.races ?? 0;
  }

  const roundConfig = PLAYOFF_ROUNDS[playoffRound - 1];
  if (!roundConfig) return [];

  const startRace = playoffStartRace + raceOffset;
  const endRace = startRace + roundConfig.races - 1;

  return races.filter((race) => race.round >= startRace && race.round <= endRace);
}

// Calculate a single playoff round
function calculatePlayoffRound(
  playoffRound: number,
  qualifiedDrivers: Driver[],
  roundRaces: Race[],
  totalRaces: number
): PlayoffRound {
  const roundConfig = PLAYOFF_ROUNDS[playoffRound - 1];
  if (!roundConfig) {
    throw new Error(`Invalid playoff round: ${playoffRound}`);
  }

  const playoffStartRace = totalRaces - PLAYOFF_RACES + 1;

  // Calculate race numbers for this round
  let raceOffset = 0;
  for (let i = 0; i < playoffRound - 1; i++) {
    raceOffset += PLAYOFF_ROUNDS[i]?.races ?? 0;
  }
  const raceNumbers = Array.from(
    { length: roundConfig.races },
    (_, i) => playoffStartRace + raceOffset + i
  );

  // Calculate standings for this round only (points reset each round)
  const standings = calculateStandings(qualifiedDrivers, roundRaces, roundRaces);

  // Determine eliminated and advancing drivers
  const eliminated: string[] = [];
  const advancing: string[] = [];

  if (playoffRound === PLAYOFF_ROUNDS.length) {
    // Championship final - winner takes all
    if (standings[0]) {
      advancing.push(standings[0].driver.driverId);
    }
    standings.slice(1).forEach((s) => eliminated.push(s.driver.driverId));
  } else {
    // Regular elimination round
    const advancingCount = roundConfig.endDrivers;

    standings.slice(0, advancingCount).forEach((s) => advancing.push(s.driver.driverId));
    standings.slice(advancingCount).forEach((s) => eliminated.push(s.driver.driverId));
  }

  return {
    round: playoffRound,
    raceNumbers,
    standings,
    eliminated,
    advancing,
  };
}

// Calculate complete playoff state for a season
export function calculatePlayoffState(races: Race[], calendar: RaceCalendar[]): PlayoffState {
  const totalRaces = calendar.length;
  const regularSeasonEnd = totalRaces - PLAYOFF_RACES;
  const playoffStartRace = regularSeasonEnd + 1;
  const completedRaces = races.length;

  // Extract all drivers from the season
  const allDrivers = extractDrivers(races);

  // Calculate regular season standings
  const regularSeasonRaces = getRegularSeasonRaces(races, totalRaces);
  const regularSeasonStandings = calculateStandings(allDrivers, regularSeasonRaces);

  // Determine qualified drivers (top 10 from regular season)
  const qualifiedDriverIds = regularSeasonStandings
    .slice(0, PLAYOFF_QUALIFIERS)
    .map((s) => s.driver.driverId);

  // Determine season status
  const status = determineSeasonStatus(calendar, completedRaces);

  // Calculate playoff rounds
  const rounds: PlayoffRound[] = [];
  let currentQualifiedDrivers = allDrivers.filter((d) => qualifiedDriverIds.includes(d.driverId));
  let champion: string | null = null;

  for (let roundNum = 1; roundNum <= PLAYOFF_ROUNDS.length; roundNum++) {
    const roundRaces = getPlayoffRoundRaces(races, totalRaces, roundNum);

    // Only calculate if we have races for this round
    if (roundRaces.length === 0) {
      break;
    }

    const roundConfig = PLAYOFF_ROUNDS[roundNum - 1];
    if (!roundConfig) break;

    // Check if round is complete
    const isRoundComplete = roundRaces.length >= roundConfig.races;

    const round = calculatePlayoffRound(roundNum, currentQualifiedDrivers, roundRaces, totalRaces);
    rounds.push(round);

    // If round is complete, update qualified drivers for next round
    if (isRoundComplete) {
      currentQualifiedDrivers = currentQualifiedDrivers.filter((d) =>
        round.advancing.includes(d.driverId)
      );

      // Check for champion (final round complete)
      if (roundNum === PLAYOFF_ROUNDS.length && round.advancing.length > 0) {
        champion = round.advancing[0] ?? null;
      }
    }
  }

  return {
    season: races[0]?.season ?? calendar[0]?.season ?? 0,
    totalRaces,
    regularSeasonRaces: regularSeasonEnd,
    playoffStartRace,
    regularSeasonStandings,
    qualifiedDrivers: qualifiedDriverIds,
    rounds,
    champion,
    status,
  };
}
