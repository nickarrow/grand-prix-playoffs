import { Box, Container, Typography, Divider } from '@mui/material';

export function AboutPage(): React.ReactElement {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h1" component="h1" gutterBottom>
          About Grand Prix Playoffs
        </Typography>

        <Typography variant="body1" paragraph color="text.secondary">
          Grand Prix Playoffs is an independent reimagining of the modern Formula 1 World
          Drivers&apos; Championship.
        </Typography>

        <Typography variant="body1" paragraph>
          For decades, the title has been decided by cumulative points over a long season. While
          consistency is rewarded, the championship is often settled before the final race.
        </Typography>

        <Typography variant="body1" paragraph>
          Grand Prix Playoffs introduces a different standard: The title should be decided under
          elimination pressure — on track — at the end of the season.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h2" component="h2" gutterBottom>
          The Philosophy
        </Typography>

        <Typography variant="body1" paragraph>
          Grand Prix racing is at its best when everything is on the line. Grand Prix Playoffs is
          built on three principles:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 3 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Merit</strong> — Reward performance across the season.
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Pressure</strong> — Demand excellence when elimination is real.
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Finality</strong> — Ensure the championship is decided at the final event.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h2" component="h2" gutterBottom>
          The Format
        </Typography>

        <Typography variant="body1" paragraph>
          Using official Grand Prix results and points, the season is restructured into a playoff
          system:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 3 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Drivers qualify for the postseason based on regular season performance.
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            The postseason consists of 4 rounds which progressively eliminate drivers.
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Four drivers advance to the final race.
          </Typography>
          <Typography component="li" variant="body1">
            The championship is decided in a winner-take-all showdown.
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          Every race carries weight. Every round raises the stakes. The final Grand Prix determines
          the champion.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Grand Prix Playoffs is an independent fan project and is not affiliated with, endorsed by,
          or associated with Formula One Group, the FIA, or Formula 1.
        </Typography>
      </Box>
    </Container>
  );
}
