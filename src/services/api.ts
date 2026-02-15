// Unified API Service with TanStack Query integration
// Uses static data for completed seasons, live API for current season

import { useQuery } from '@tanstack/react-query';

import type { Race, RaceCalendar } from 'src/types';

import { fetchSeasonCalendar, fetchRaceResults, fetchSeasonResults } from './jolpica';
import { loadStaticSeasonData } from './static-data';

// Query key factories for consistent cache keys
export const queryKeys = {
  // Season-related keys
  seasons: {
    all: ['seasons'] as const,
    calendar: (year: number) => [...queryKeys.seasons.all, 'calendar', year] as const,
    results: (year: number) => [...queryKeys.seasons.all, 'results', year] as const,
    full: (year: number) => [...queryKeys.seasons.all, 'full', year] as const,
  },
  // Race-related keys
  races: {
    all: ['races'] as const,
    detail: (year: number, round: number) => [...queryKeys.races.all, year, round] as const,
  },
} as const;

// Fetch season calendar - prefer static data
async function getSeasonCalendar(year: number): Promise<RaceCalendar[]> {
  // Try static data first
  const staticData = await loadStaticSeasonData(year);
  if (staticData) {
    return staticData.calendar;
  }

  // Fall back to live API
  try {
    return await fetchSeasonCalendar(year);
  } catch (error) {
    console.error(`Failed to fetch ${year} calendar:`, error);
    throw error;
  }
}

// Fetch all season results - prefer static data
async function getSeasonResults(year: number): Promise<Race[]> {
  // Try static data first
  const staticData = await loadStaticSeasonData(year);
  if (staticData) {
    return staticData.races;
  }

  // Fall back to live API
  try {
    return await fetchSeasonResults(year);
  } catch (error) {
    console.error(`Failed to fetch ${year} results:`, error);
    throw error;
  }
}

// Fetch single race with error handling
async function getRaceResults(year: number, round: number): Promise<Race | null> {
  try {
    return await fetchRaceResults(year, round);
  } catch (error) {
    console.error(`Failed to fetch race ${year}/${round}:`, error);
    throw error;
  }
}

// TanStack Query hooks

export function useSeasonCalendar(
  year: number
): ReturnType<typeof useQuery<RaceCalendar[], Error>> {
  return useQuery({
    queryKey: queryKeys.seasons.calendar(year),
    queryFn: () => getSeasonCalendar(year),
  });
}

export function useSeasonResults(year: number): ReturnType<typeof useQuery<Race[], Error>> {
  return useQuery({
    queryKey: queryKeys.seasons.results(year),
    queryFn: () => getSeasonResults(year),
  });
}

export function useRaceResults(
  year: number,
  round: number
): ReturnType<typeof useQuery<Race | null, Error>> {
  return useQuery({
    queryKey: queryKeys.races.detail(year, round),
    queryFn: () => getRaceResults(year, round),
  });
}

// Combined hook to fetch full season data (calendar + results)
export function useSeasonData(year: number): {
  calendar: RaceCalendar[] | undefined;
  races: Race[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  const calendarQuery = useSeasonCalendar(year);
  const resultsQuery = useSeasonResults(year);

  return {
    calendar: calendarQuery.data,
    races: resultsQuery.data,
    isLoading: calendarQuery.isLoading || resultsQuery.isLoading,
    error: calendarQuery.error ?? resultsQuery.error,
  };
}
