import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Trophy } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { usePlayoffData } from 'src/hooks';
import { StandingsTable } from 'src/components/standings';
import { PlayoffExplainer } from 'src/components/common';
import { TROPHY_ICON_SIZE_LARGE, getTeamColor } from 'src/constants';
import { PODIUM_COLORS } from 'src/theme/palette';

export function SeasonPage(): React.ReactElement {
  const { year } = useParams<{ year: string }>();
  const seasonYear = parseInt(year ?? '2025', 10);
  const theme = useTheme();
  const mode = theme.palette.mode;

  const { playoffState, races, isLoading, error } = usePlayoffData(seasonYear);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            Failed to load {seasonYear} data: {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  // No data yet (e.g., 2026 season hasn't started)
  if (!playoffState || races.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {seasonYear} Grand Prix Playoffs
          </Typography>
          <PlayoffExplainer compact />
          <Alert severity="info" sx={{ mt: 2 }}>
            The {seasonYear} season hasn't started yet. Check back once races begin!
          </Alert>
        </Box>
      </Container>
    );
  }

  // Build status text based on season state
  const getStatusText = (): string => {
    const { status, totalRaces, playoffStartRace, rounds } = playoffState;
    const completedRaces = races.length;
    const racesUntilPlayoffs = playoffStartRace - completedRaces - 1;

    if (status === 'completed') {
      return `✓ Season Complete • ${totalRaces} races`;
    }

    if (status === 'pre-season') {
      return 'Season not started';
    }

    if (status === 'regular-season') {
      if (racesUntilPlayoffs === 1) {
        return `Race ${completedRaces} of ${totalRaces} • Playoffs begin next race`;
      }
      return `Race ${completedRaces} of ${totalRaces} • ${racesUntilPlayoffs} races until playoffs`;
    }

    // Playoffs - figure out which round
    const currentRound = rounds.find((r) => r.raceNumbers.some((rn) => rn > completedRaces));
    if (currentRound) {
      if (currentRound.round === 4) {
        return `Championship Final • Race ${completedRaces} of ${totalRaces}`;
      }
      return `Playoff Round ${currentRound.round} • Race ${completedRaces} of ${totalRaces}`;
    }

    return `Playoffs • Race ${completedRaces} of ${totalRaces}`;
  };

  // Get champion info for completed seasons
  const getChampionInfo = (): { code: string; constructorId: string } | null => {
    if (playoffState.status !== 'completed' || !playoffState.champion) {
      return null;
    }
    const finalRound = playoffState.rounds[playoffState.rounds.length - 1];
    const championStanding = finalRound?.standings.find(
      (s) => s.driver.driverId === playoffState.champion
    );
    return championStanding
      ? { code: championStanding.driver.code, constructorId: championStanding.driver.constructorId }
      : null;
  };

  const championInfo = getChampionInfo();
  const teamColor = championInfo ? getTeamColor(championInfo.constructorId).primary : null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {playoffState.season} Grand Prix Playoffs
        </Typography>

        <PlayoffExplainer compact />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {getStatusText()}
          </Typography>
          {championInfo && (
            <>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  py: 0.25,
                  px: 1,
                  borderLeft: 3,
                  borderColor: teamColor,
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {championInfo.code}
                </Typography>
              </Box>
              <Trophy
                size={TROPHY_ICON_SIZE_LARGE}
                color={mode === 'dark' ? PODIUM_COLORS.gold.dark : PODIUM_COLORS.gold.light}
              />
            </>
          )}
        </Box>

        <StandingsTable playoffState={playoffState} allRaces={races} />
      </Box>
    </Container>
  );
}
