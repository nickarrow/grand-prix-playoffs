import { describe, it, expect } from 'vitest';

import { PLAYOFF_QUALIFIERS, ELIMINATIONS_PER_ROUND } from 'src/constants';
import type { Race, RaceCalendar } from 'src/types';

import {
  determineSeasonStatus,
  getRegularSeasonRaces,
  getPlayoffRoundRaces,
  calculatePlayoffState,
} from './playoffs';

// Helper to create mock calendar
const createCalendar = (totalRaces: number): RaceCalendar[] =>
  Array.from({ length: totalRaces }, (_, i) => ({
    season: 2025,
    round: i + 1,
    raceName: `Race ${i + 1}`,
    circuitId: `circuit${i + 1}`,
    circuitName: `Circuit ${i + 1}`,
    country: 'Test',
    date: `2025-${String(Math.floor(i / 2) + 3).padStart(2, '0')}-${String((i % 2) * 15 + 1).padStart(2, '0')}`,
    hasSprintRace: false,
  }));

// Helper to create mock race
const createRace = (
  round: number,
  driverResults: Array<{ id: string; position: number | null }>
): Race => ({
  season: 2025,
  round,
  raceName: `Race ${round}`,
  circuitId: `circuit${round}`,
  circuitName: `Circuit ${round}`,
  country: 'Test',
  date: '2025-01-01',
  results: driverResults.map((r) => ({
    driverId: r.id,
    position: r.position,
    points:
      r.position && r.position <= 10
        ? ([25, 18, 15, 12, 10, 8, 6, 4, 2, 1][r.position - 1] ?? 0)
        : 0,
    grid: 1,
    status: r.position ? 'Finished' : 'Retired',
    fastestLap: false,
    fastestLapRank: null,
  })),
  qualifying: [],
  sprint: null,
});

describe('determineSeasonStatus', () => {
  it('should return pre-season when no races completed', () => {
    const calendar = createCalendar(24);
    const status = determineSeasonStatus(calendar, 0, new Date('2025-01-01'));
    expect(status).toBe('pre-season');
  });

  it('should return regular-season during regular season', () => {
    const calendar = createCalendar(24);
    // Regular season = races 1-17 for 24-race season
    const status = determineSeasonStatus(calendar, 10, new Date('2025-06-01'));
    expect(status).toBe('regular-season');
  });

  it('should return playoffs when in playoff races', () => {
    const calendar = createCalendar(24);
    // Playoffs start at race 18 (24 - 7 + 1)
    const status = determineSeasonStatus(calendar, 18, new Date('2025-10-01'));
    expect(status).toBe('playoffs');
  });

  it('should return completed when all races done', () => {
    const calendar = createCalendar(24);
    const status = determineSeasonStatus(calendar, 24, new Date('2025-12-15'));
    expect(status).toBe('completed');
  });
});

describe('getRegularSeasonRaces', () => {
  it('should return correct regular season races', () => {
    const races = Array.from({ length: 20 }, (_, i) =>
      createRace(i + 1, [{ id: 'a', position: 1 }])
    );

    const regularSeason = getRegularSeasonRaces(races, 24);

    // For 24-race season, regular season = races 1-17
    expect(regularSeason).toHaveLength(17);
    expect(regularSeason[0]?.round).toBe(1);
    expect(regularSeason[16]?.round).toBe(17);
  });
});

describe('getPlayoffRoundRaces', () => {
  it('should return correct races for playoff round 1', () => {
    const races = Array.from({ length: 24 }, (_, i) =>
      createRace(i + 1, [{ id: 'a', position: 1 }])
    );

    const round1Races = getPlayoffRoundRaces(races, 24, 1);

    // Round 1 = races 18-19 for 24-race season
    expect(round1Races).toHaveLength(2);
    expect(round1Races[0]?.round).toBe(18);
    expect(round1Races[1]?.round).toBe(19);
  });

  it('should return correct races for playoff round 2', () => {
    const races = Array.from({ length: 24 }, (_, i) =>
      createRace(i + 1, [{ id: 'a', position: 1 }])
    );

    const round2Races = getPlayoffRoundRaces(races, 24, 2);

    // Round 2 = races 20-21
    expect(round2Races).toHaveLength(2);
    expect(round2Races[0]?.round).toBe(20);
    expect(round2Races[1]?.round).toBe(21);
  });

  it('should return correct races for championship final', () => {
    const races = Array.from({ length: 24 }, (_, i) =>
      createRace(i + 1, [{ id: 'a', position: 1 }])
    );

    const finalRaces = getPlayoffRoundRaces(races, 24, 4);

    // Final = race 24 only
    expect(finalRaces).toHaveLength(1);
    expect(finalRaces[0]?.round).toBe(24);
  });
});

describe('calculatePlayoffState', () => {
  // Create 12 drivers for testing
  const driverIds = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12'];

  // Create a full season of races where d1 always wins, d2 always 2nd, etc.
  const createFullSeason = (totalRaces: number): Race[] =>
    Array.from({ length: totalRaces }, (_, i) =>
      createRace(
        i + 1,
        driverIds.map((id, pos) => ({ id, position: pos + 1 }))
      )
    );

  it('should qualify top 10 drivers from regular season', () => {
    const calendar = createCalendar(24);
    const races = createFullSeason(17); // Just regular season

    const state = calculatePlayoffState(races, calendar);

    expect(state.qualifiedDrivers).toHaveLength(PLAYOFF_QUALIFIERS);
    // d1-d10 should qualify (top 10 by points)
    expect(state.qualifiedDrivers).toContain('d1');
    expect(state.qualifiedDrivers).toContain('d10');
    expect(state.qualifiedDrivers).not.toContain('d11');
    expect(state.qualifiedDrivers).not.toContain('d12');
  });

  it('should eliminate bottom 2 drivers after round 1', () => {
    const calendar = createCalendar(24);
    const races = createFullSeason(19); // Through round 1

    const state = calculatePlayoffState(races, calendar);

    expect(state.rounds).toHaveLength(1);
    expect(state.rounds[0]?.eliminated).toHaveLength(ELIMINATIONS_PER_ROUND);
    expect(state.rounds[0]?.advancing).toHaveLength(8);
  });

  it('should crown champion after final race', () => {
    const calendar = createCalendar(24);
    const races = createFullSeason(24); // Complete season

    const state = calculatePlayoffState(races, calendar);

    expect(state.champion).toBe('d1'); // d1 wins every race
    expect(state.status).toBe('completed');
    expect(state.rounds).toHaveLength(4);
  });

  it('should reset points each playoff round', () => {
    const calendar = createCalendar(24);
    const races = createFullSeason(21); // Through round 2

    const state = calculatePlayoffState(races, calendar);

    // Round 2 standings should only reflect races 20-21, not cumulative
    const round2 = state.rounds[1];
    expect(round2).toBeDefined();

    // Each driver should have points from only 2 races
    // d1 wins both = 50 points (25 + 25)
    const d1Standing = round2?.standings.find((s) => s.driver.driverId === 'd1');
    expect(d1Standing?.points).toBe(50);
  });
});
