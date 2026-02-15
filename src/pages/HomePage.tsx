import { Box, Container, Typography, CircularProgress, Alert, Paper } from '@mui/material';

import { usePlayoffData } from 'src/hooks';
import { DEFAULT_SEASON } from 'src/constants';

export function HomePage(): React.ReactElement {
  const { playoffState, isLoading, error } = usePlayoffData(DEFAULT_SEASON);

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
          <Alert severity="error">Failed to load data: {error.message}</Alert>
        </Box>
      </Container>
    );
  }

  if (!playoffState) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No data available</Alert>
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
          Status: {playoffState.status} | Total Races: {playoffState.totalRaces} | Playoff Start:
          Race {playoffState.playoffStartRace}
        </Typography>

        {/* Regular Season Top 10 */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Regular Season Standings (Top 10 Qualify)
          </Typography>
          {playoffState.regularSeasonStandings.slice(0, 10).map((standing, idx) => (
            <Typography
              key={standing.driver.driverId}
              variant="body2"
              sx={{ fontFamily: 'monospace' }}
            >
              {String(idx + 1).padStart(2, ' ')}. {standing.driver.firstName}{' '}
              {standing.driver.lastName} - {standing.points} pts
              {playoffState.qualifiedDrivers.includes(standing.driver.driverId) ? ' ✓' : ''}
            </Typography>
          ))}
        </Paper>

        {/* Playoff Rounds */}
        {playoffState.rounds.map((round) => (
          <Paper key={round.round} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {round.round === 4 ? 'Championship Final' : `Playoff Round ${round.round}`} (Races{' '}
              {round.raceNumbers.join(', ')})
            </Typography>
            {round.standings.map((standing, idx) => {
              const isEliminated = round.eliminated.includes(standing.driver.driverId);
              const isAdvancing = round.advancing.includes(standing.driver.driverId);
              const driverName = `${standing.driver.firstName} ${standing.driver.lastName}`;
              return (
                <Typography
                  key={standing.driver.driverId}
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    color: isEliminated
                      ? 'error.main'
                      : isAdvancing
                        ? 'success.main'
                        : 'text.primary',
                  }}
                >
                  {String(idx + 1).padStart(2, ' ')}. {driverName} - {standing.points} pts
                  {isEliminated ? ' ✗ ELIMINATED' : ''}
                  {isAdvancing && round.round === 4 ? ' 🏆 CHAMPION' : ''}
                </Typography>
              );
            })}
          </Paper>
        ))}

        {playoffState.champion && (
          <Alert severity="success" sx={{ mt: 2 }}>
            🏆 {playoffState.season} Grand Prix Playoffs Champion: {playoffState.champion}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
