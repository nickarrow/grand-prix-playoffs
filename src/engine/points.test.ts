import { describe, it, expect } from 'vitest';

import {
  RACE_POINTS,
  SPRINT_POINTS,
  POLE_POSITION_POINTS,
  FASTEST_LAP_POINTS,
} from 'src/constants';
import type { Race } from 'src/types';

import { getRacePoints, getSprintPoints, calculateRaceWeekendPoints } from './points';

describe('getRacePoints', () => {
  it('should return correct points for positions 1-10', () => {
    expect(getRacePoints(1)).toBe(RACE_POINTS[0]); // 25
    expect(getRacePoints(2)).toBe(RACE_POINTS[1]); // 18
    expect(getRacePoints(3)).toBe(RACE_POINTS[2]); // 15
    expect(getRacePoints(10)).toBe(RACE_POINTS[9]); // 1
  });

  it('should return 0 for positions outside top 10', () => {
    expect(getRacePoints(11)).toBe(0);
    expect(getRacePoints(20)).toBe(0);
  });

  it('should return 0 for null position (DNF)', () => {
    expect(getRacePoints(null)).toBe(0);
  });

  it('should return 0 for invalid positions', () => {
    expect(getRacePoints(0)).toBe(0);
    expect(getRacePoints(-1)).toBe(0);
  });
});

describe('getSprintPoints', () => {
  it('should return correct points for positions 1-8', () => {
    expect(getSprintPoints(1)).toBe(SPRINT_POINTS[0]); // 8
    expect(getSprintPoints(8)).toBe(SPRINT_POINTS[7]); // 1
  });

  it('should return 0 for positions outside top 8', () => {
    expect(getSprintPoints(9)).toBe(0);
    expect(getSprintPoints(10)).toBe(0);
  });
});

describe('calculateRaceWeekendPoints', () => {
  const createMockRace = (overrides: Partial<Race> = {}): Race => ({
    season: 2025,
    round: 1,
    raceName: 'Test GP',
    circuitId: 'test',
    circuitName: 'Test Circuit',
    country: 'Test',
    date: '2025-03-01',
    results: [],
    qualifying: [],
    sprint: null,
    ...overrides,
  });

  it('should calculate race points correctly', () => {
    const race = createMockRace({
      results: [
        {
          driverId: 'verstappen',
          position: 1,
          points: 25,
          grid: 1,
          status: 'Finished',
          fastestLap: false,
          fastestLapRank: null,
        },
      ],
    });

    expect(calculateRaceWeekendPoints('verstappen', race)).toBe(25);
  });

  it('should add fastest lap bonus when eligible', () => {
    const race = createMockRace({
      results: [
        {
          driverId: 'verstappen',
          position: 1,
          points: 25,
          grid: 1,
          status: 'Finished',
          fastestLap: true,
          fastestLapRank: 1,
        },
      ],
    });

    expect(calculateRaceWeekendPoints('verstappen', race)).toBe(25 + FASTEST_LAP_POINTS);
  });

  it('should add pole position bonus', () => {
    const race = createMockRace({
      results: [
        {
          driverId: 'verstappen',
          position: 1,
          points: 25,
          grid: 1,
          status: 'Finished',
          fastestLap: false,
          fastestLapRank: null,
        },
      ],
      qualifying: [{ driverId: 'verstappen', position: 1 }],
    });

    expect(calculateRaceWeekendPoints('verstappen', race)).toBe(25 + POLE_POSITION_POINTS);
  });

  it('should add sprint points when sprint race exists', () => {
    const race = createMockRace({
      results: [
        {
          driverId: 'verstappen',
          position: 1,
          points: 25,
          grid: 1,
          status: 'Finished',
          fastestLap: false,
          fastestLapRank: null,
        },
      ],
      sprint: [{ driverId: 'verstappen', position: 1, points: 8 }],
    });

    expect(calculateRaceWeekendPoints('verstappen', race)).toBe(25 + 8);
  });

  it('should return 0 for DNF', () => {
    const race = createMockRace({
      results: [
        {
          driverId: 'verstappen',
          position: null,
          points: 0,
          grid: 1,
          status: 'Retired',
          fastestLap: false,
          fastestLapRank: null,
        },
      ],
    });

    expect(calculateRaceWeekendPoints('verstappen', race)).toBe(0);
  });

  it('should return 0 for driver not in race', () => {
    const race = createMockRace({
      results: [
        {
          driverId: 'hamilton',
          position: 1,
          points: 25,
          grid: 1,
          status: 'Finished',
          fastestLap: false,
          fastestLapRank: null,
        },
      ],
    });

    expect(calculateRaceWeekendPoints('verstappen', race)).toBe(0);
  });
});
