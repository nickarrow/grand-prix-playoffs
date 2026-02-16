import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';

import { usePlayoffData } from 'src/hooks';
import { StandingsTable } from 'src/components/standings';
import { PlayoffExplainer } from 'src/components/common';

export function SeasonPage(): React.ReactElement {
  const { year } = useParams<{ year: string }>();
  const seasonYear = parseInt(year ?? '2025', 10);

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
        return `🏁 Championship Final • Race ${completedRaces} of ${totalRaces}`;
      }
      return `🏁 Playoff Round ${currentRound.round} • Race ${completedRaces} of ${totalRaces}`;
    }

    return `🏁 Playoffs • Race ${completedRaces} of ${totalRaces}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {playoffState.season} Grand Prix Playoffs
        </Typography>

        <PlayoffExplainer compact />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getStatusText()}
        </Typography>

        <StandingsTable playoffState={playoffState} allRaces={races} />
      </Box>
    </Container>
  );
}
