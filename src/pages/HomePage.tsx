import { Box, Container, Typography } from '@mui/material';

export function HomePage(): React.ReactElement {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Grand Prix Playoffs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming soon.
        </Typography>
      </Box>
    </Container>
  );
}
