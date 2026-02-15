import { Box, Container, Typography } from '@mui/material';

export function HomePage(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Grand Prix Playoffs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reimagining the Formula 1 Drivers&apos; Championship as a true elimination battle.
        </Typography>
      </Box>
    </Container>
  );
}
