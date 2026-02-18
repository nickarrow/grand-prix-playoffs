import { describe, it, expect } from 'vitest';

import type { PlayoffState, PlayoffRound, DriverStanding } from 'src/types';

import { getEliminationRound, getBracketPoints, getPlayoffRoundPoints } from './index';

// Helper to create a mock driver standing
const createStanding = (driverId: string, points: number): DriverStanding => ({
  driver: {
    driverId,
    code: driverId.toUpperCase(),
    firstName: 'Test',
    lastName: driverId,
    nationality: 'Test',
    constructorId: 'test',
    constructorName: 'Test Team',
  },
  points,
  wins: 0,
  podiums: 0,
  position: 1,
  positionHistory: [],
  officialPoints: 0,
});

// Helper to create a mock playoff round
const createRound = (
  roundNum: number,
  standings: Array<{ id: string; points: number }>,
  eliminated: string[] = []
): PlayoffRound => ({
  round: roundNum,
  raceNumbers: [roundNum],
  standings: standings.map((s) => createStanding(s.id, s.points)),
  eliminated,
  advancing: standings.filter((s) => !eliminated.includes(s.id)).map((s) => s.id),
});

describe('getEliminationRound', () => {
  it('should return -1 for non-qualifiers', () => {
    const state: PlayoffState = {
      season: 2025,
      totalRaces: 24,
      regularSeasonRaces: 17,
      playoffStartRace: 18,
      regularSeasonStandings: [],
      qualifiedDrivers: ['d1', 'd2', 'd3'],
      rounds: [],
      champion: null,
      status: 'playoffs',
    };

    expect(getEliminationRound('d11', state)).toBe(-1);
  });

  it('should return 0 for finalists still competing', () => {
    const state: PlayoffState = {
      season: 2025,
      totalRaces: 24,
      regularSeasonRaces: 17,
      playoffStartRace: 18,
      regularSeasonStandings: [],
      qualifiedDrivers: ['d1', 'd2', 'd3'],
      rounds: [createRound(1, [{ id: 'd1', points: 50 }], [])],
      champion: null,
      status: 'playoffs',
    };

    expect(getEliminationRound('d1', state)).toBe(0);
  });

  it('should return elimination round number', () => {
    const state: PlayoffState = {
      season: 2025,
      totalRaces: 24,
      regularSeasonRaces: 17,
      playoffStartRace: 18,
      regularSeasonStandings: [],
      qualifiedDrivers: ['d1', 'd2', 'd3'],
      rounds: [
        createRound(
          1,
          [
            { id: 'd1', points: 50 },
            { id: 'd2', points: 40 },
            { id: 'd3', points: 30 },
          ],
          ['d3']
        ),
      ],
      champion: null,
      status: 'playoffs',
    };

    expect(getEliminationRound('d3', state)).toBe(1);
  });
});

describe('getPlayoffRoundPoints', () => {
  it('should return null for undefined round', () => {
    expect(getPlayoffRoundPoints(undefined, 'd1')).toBeNull();
  });

  it('should return null for driver not in standings', () => {
    const round = createRound(1, [{ id: 'd1', points: 50 }], []);
    expect(getPlayoffRoundPoints(round, 'd99')).toBeNull();
  });

  it('should return points for driver in standings', () => {
    const round = createRound(
      1,
      [
        { id: 'd1', points: 50 },
        { id: 'd2', points: 40 },
      ],
      []
    );
    expect(getPlayoffRoundPoints(round, 'd1')).toBe(50);
    expect(getPlayoffRoundPoints(round, 'd2')).toBe(40);
  });
});

describe('getBracketPoints', () => {
  it('should return 0 when no rounds exist', () => {
    const state: PlayoffState = {
      season: 2025,
      totalRaces: 24,
      regularSeasonRaces: 17,
      playoffStartRace: 18,
      regularSeasonStandings: [],
      qualifiedDrivers: ['d1'],
      rounds: [],
      champion: null,
      status: 'regular-season',
    };

    expect(getBracketPoints('d1', 1, state)).toBe(0);
  });

  it('should sum points from start round onward', () => {
    const state: PlayoffState = {
      season: 2025,
      totalRaces: 24,
      regularSeasonRaces: 17,
      playoffStartRace: 18,
      regularSeasonStandings: [],
      qualifiedDrivers: ['d1'],
      rounds: [
        createRound(1, [{ id: 'd1', points: 50 }], []),
        createRound(2, [{ id: 'd1', points: 40 }], []),
        createRound(3, [{ id: 'd1', points: 30 }], []),
      ],
      champion: null,
      status: 'playoffs',
    };

    // From R1: 50 + 40 + 30 = 120
    expect(getBracketPoints('d1', 1, state)).toBe(120);
    // From R2: 40 + 30 = 70
    expect(getBracketPoints('d1', 2, state)).toBe(70);
    // From R3: 30
    expect(getBracketPoints('d1', 3, state)).toBe(30);
  });

  it('should handle driver not in some rounds', () => {
    const state: PlayoffState = {
      season: 2025,
      totalRaces: 24,
      regularSeasonRaces: 17,
      playoffStartRace: 18,
      regularSeasonStandings: [],
      qualifiedDrivers: ['d1', 'd2'],
      rounds: [
        createRound(
          1,
          [
            { id: 'd1', points: 50 },
            { id: 'd2', points: 40 },
          ],
          []
        ),
        createRound(2, [{ id: 'd1', points: 30 }], []), // d2 not in R2
      ],
      champion: null,
      status: 'playoffs',
    };

    // d2 only has R1 points
    expect(getBracketPoints('d2', 1, state)).toBe(40);
  });
});
