import { Box, Container, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { usePlayoffData } from 'src/hooks';
import { StandingsTable } from 'src/components/standings';
import { CURRENT_SEASON } from 'src/constants';

export function HomePage(): React.ReactElement {
  const { playoffState, races, isLoading, error } = usePlayoffData(CURRENT_SEASON);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        {/* Hero section */}
        <Box sx={{ mb: 4, textAlign: { xs: 'left', md: 'center' } }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Grand Prix Playoffs
          </Typography>
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            The F1 championship, reimagined.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: { md: 'auto' }, mb: 1.5, lineHeight: 1.7 }}
          >
            F1 titles are often decided before the final race. Grand Prix Playoffs reimagines the
            championship as a playoff where the top 10 drivers from the regular season advance to a
            7-race playoff until only 4 drivers remain for a winner-take-all finale.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 1,
            }}
          >
            <Button
              component={RouterLink}
              to="/about"
              variant="outlined"
              size="medium"
              sx={{ textTransform: 'none' }}
            >
              How it works
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/2024"
                variant="text"
                size="medium"
                sx={{ textTransform: 'none' }}
              >
                View 2024 results
              </Button>
              <Button
                component={RouterLink}
                to="/2025"
                variant="text"
                size="medium"
                sx={{ textTransform: 'none' }}
              >
                View 2025 results
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Current season standings */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2" fontWeight={600}>
              {CURRENT_SEASON} Standings
            </Typography>
            <Button
              component={RouterLink}
              to={`/${CURRENT_SEASON}`}
              endIcon={<ArrowRight size={16} />}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Full details
            </Button>
          </Box>

          {isLoading && (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error">Failed to load standings: {error.message}</Alert>}

          {!isLoading && !error && (!playoffState || races.length === 0) && (
            <Alert severity="info">
              The {CURRENT_SEASON} season hasn't started yet. Check back once races begin!
            </Alert>
          )}

          {!isLoading && !error && playoffState && races.length > 0 && (
            <StandingsTable playoffState={playoffState} allRaces={races} />
          )}
        </Paper>
      </Box>
    </Container>
  );
}
