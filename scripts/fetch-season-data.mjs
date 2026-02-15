#!/usr/bin/env node
/**
 * Fetches F1 season data from Jolpica API and saves as static JSON.
 * Usage: node scripts/fetch-season-data.mjs [year]
 * Example: node scripts/fetch-season-data.mjs 2025
 */

const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const RATE_LIMIT_DELAY_MS = 300;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchSeasonCalendar(year) {
  console.log(`Fetching ${year} calendar...`);
  const data = await fetchJson(`${JOLPICA_BASE_URL}/${year}.json`);
  return data.MRData.RaceTable.Races.map((race) => ({
    season: parseInt(race.season, 10),
    round: parseInt(race.round, 10),
    raceName: race.raceName,
    circuitId: race.Circuit.circuitId,
    circuitName: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    date: race.date,
  }));
}

async function fetchRaceResults(year, round) {
  // Fetch race results
  const raceData = await fetchJson(`${JOLPICA_BASE_URL}/${year}/${round}/results.json`);
  const raceInfo = raceData.MRData.RaceTable.Races[0];
  
  if (!raceInfo?.Results) {
    return null;
  }

  await delay(RATE_LIMIT_DELAY_MS);
  const qualifyingData = await fetchJson(`${JOLPICA_BASE_URL}/${year}/${round}/qualifying.json`).catch(() => null);
  
  await delay(RATE_LIMIT_DELAY_MS);
  const sprintData = await fetchJson(`${JOLPICA_BASE_URL}/${year}/${round}/sprint.json`).catch(() => null);

  const qualifyingInfo = qualifyingData?.MRData?.RaceTable?.Races?.[0];
  const sprintInfo = sprintData?.MRData?.RaceTable?.Races?.[0];

  return {
    season: parseInt(raceInfo.season, 10),
    round: parseInt(raceInfo.round, 10),
    raceName: raceInfo.raceName,
    circuitId: raceInfo.Circuit.circuitId,
    circuitName: raceInfo.Circuit.circuitName,
    country: raceInfo.Circuit.Location.country,
    date: raceInfo.date,
    results: raceInfo.Results.map((r) => ({
      driverId: r.Driver.driverId,
      driverCode: r.Driver.code || r.Driver.driverId.substring(0, 3).toUpperCase(),
      firstName: r.Driver.givenName,
      lastName: r.Driver.familyName,
      constructorId: r.Constructor.constructorId,
      constructorName: r.Constructor.name,
      position: r.status === 'Finished' || r.status.includes('Lap') ? parseInt(r.position, 10) : null,
      points: parseFloat(r.points),
      grid: parseInt(r.grid, 10),
      status: r.status,
      fastestLap: r.FastestLap?.rank === '1' && parseInt(r.position, 10) <= 10,
      fastestLapRank: r.FastestLap ? parseInt(r.FastestLap.rank, 10) : null,
    })),
    qualifying: qualifyingInfo?.QualifyingResults?.map((q) => ({
      driverId: q.Driver.driverId,
      position: parseInt(q.position, 10),
    })) ?? [],
    sprint: sprintInfo?.SprintResults?.map((s) => ({
      driverId: s.Driver.driverId,
      position: s.status === 'Finished' || s.status.includes('Lap') ? parseInt(s.position, 10) : null,
      points: parseFloat(s.points),
    })) ?? null,
  };
}


async function fetchSeasonData(year) {
  const calendar = await fetchSeasonCalendar(year);
  const races = [];

  for (const entry of calendar) {
    console.log(`Fetching race ${entry.round}/${calendar.length}: ${entry.raceName}...`);
    await delay(RATE_LIMIT_DELAY_MS);
    
    const race = await fetchRaceResults(year, entry.round);
    if (race) {
      races.push(race);
    } else {
      console.log(`Race ${entry.round} not yet completed, stopping.`);
      break;
    }
  }

  return { calendar, races };
}

async function main() {
  const year = parseInt(process.argv[2], 10) || new Date().getFullYear();
  
  console.log(`\n🏎️  Fetching ${year} F1 season data...\n`);
  
  try {
    const data = await fetchSeasonData(year);
    
    const fs = await import('fs');
    const path = await import('path');
    
    const outputDir = path.join(process.cwd(), 'data');
    const outputFile = path.join(outputDir, `${year}.json`);
    
    // Ensure data directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    
    console.log(`\n✅ Saved ${data.races.length} races to ${outputFile}`);
    console.log(`   Calendar: ${data.calendar.length} races scheduled`);
    console.log(`   Completed: ${data.races.length} races\n`);
  } catch (error) {
    console.error('\n❌ Error fetching data:', error.message);
    process.exit(1);
  }
}

main();
