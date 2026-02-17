import { Box, Container, Typography, Divider, Link } from '@mui/material';
import { ExternalLink, Github } from 'lucide-react';

import {
  PLAYOFF_RACES,
  PLAYOFF_QUALIFIERS,
  RACE_POINTS,
  SPRINT_POINTS,
  POLE_POSITION_POINTS,
  FASTEST_LAP_POINTS,
  RACES_PER_ROUND,
  PLAYOFF_ROUNDS,
} from 'src/constants';

export function AboutPage(): React.ReactElement {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          About Grand Prix Playoffs
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
          An independent, fan made, reimagining of the Formula 1 World Drivers' Championship. We
          take real race results and apply an elimination playoff format.
        </Typography>

        {/* Philosophy */}
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          The Philosophy
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          For decades, the F1 title has been decided by cumulative points over a long season. While
          consistency is rewarded, championships are often mathematically decided before the final
          race (except that one time in 2021).
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          Grand Prix Playoffs introduces a different standard: the title should be decided under
          elimination pressure, on track, at the season finale.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Format */}
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          The Format
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          The last {PLAYOFF_RACES} races of the season become the playoffs. Everything before is the
          regular season.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Regular Season
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Top {PLAYOFF_QUALIFIERS} qualify
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Round 1 ({RACES_PER_ROUND} races)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {PLAYOFF_ROUNDS[0].startDrivers} → {PLAYOFF_ROUNDS[0].endDrivers} drivers
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Round 2 ({RACES_PER_ROUND} races)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {PLAYOFF_ROUNDS[1].startDrivers} → {PLAYOFF_ROUNDS[1].endDrivers} drivers
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Round 3 ({RACES_PER_ROUND} races)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {PLAYOFF_ROUNDS[2].startDrivers} → {PLAYOFF_ROUNDS[2].endDrivers} drivers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Final ({PLAYOFF_ROUNDS[3].races} race)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Winner takes title
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Points */}
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          Points System
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          Standard F1 points are used. Points reset to zero at the start of each playoff round.
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Race Points (Top 10)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {RACE_POINTS.map((pts, i) => `P${i + 1}: ${pts}`).join(' • ')}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Sprint Points (Top 8)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {SPRINT_POINTS.map((pts, i) => `P${i + 1}: ${pts}`).join(' • ')}
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Bonus Points
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Pole Position: {POLE_POSITION_POINTS} pt • Fastest Lap: {FASTEST_LAP_POINTS} pt (if
          finished top 10)
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Tiebreakers */}
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          Tiebreakers
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          If drivers are tied on points at the end of a round, the standard F1 countback applies:
          most wins, then most 2nd places, then most 3rd places, and so on.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Links */}
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          Project
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
          <Link
            href="https://github.com/nickarrow/grand-prix-playoffs"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Github size={16} />
            View on GitHub
            <ExternalLink size={12} />
          </Link>
        </Box>

        {/* Disclaimer */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, lineHeight: 1.6 }}>
          Grand Prix Playoffs is an independent fan project. It is not affiliated with, endorsed by,
          or associated with Formula One Group, the FIA, or Formula 1. All F1-related trademarks
          belong to their respective owners.
        </Typography>
      </Box>
    </Container>
  );
}
