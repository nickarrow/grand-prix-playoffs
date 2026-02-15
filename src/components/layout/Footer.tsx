import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} Grand Prix Playoffs. An independent fan project.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Not affiliated with Formula One Group, FIA, or Formula 1.{' '}
          <MuiLink
            href="https://github.com/yourusername/grand-prix-playoffs"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            View on GitHub
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}
