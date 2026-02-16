import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';

import { usePlayoffData } from 'src/hooks';
import { StandingsTable } from 'src/components/standings';

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
          <Alert severity="info" sx={{ mt: 2 }}>
            The {seasonYear} season hasn't started yet. Check back once races begin!
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {playoffState.season} Grand Prix Playoffs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {playoffState.status === 'completed' && '✓ Season Complete'}
          {playoffState.status === 'playoffs' && '🏁 Playoffs In Progress'}
          {playoffState.status === 'regular-season' &&
            `Race ${races.length} of ${playoffState.totalRaces}`}
          {playoffState.status === 'pre-season' && 'Season Not Started'}
          {' • '}
          Playoff starts Race {playoffState.playoffStartRace}
        </Typography>

        <StandingsTable playoffState={playoffState} allRaces={races} />
      </Box>
    </Container>
  );
}
