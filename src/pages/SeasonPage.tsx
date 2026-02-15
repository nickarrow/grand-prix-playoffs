import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export function SeasonPage(): React.ReactElement {
  const { year } = useParams<{ year: string }>();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h1" component="h1" gutterBottom>
          {year} Season
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Season standings and playoff bracket coming soon.
        </Typography>
      </Box>
    </Container>
  );
}
