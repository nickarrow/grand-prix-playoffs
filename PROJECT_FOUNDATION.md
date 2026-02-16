# Grand Prix Playoffs - Project Foundation

> Reimagining the Formula 1 Drivers' Championship as a true elimination battle.

## Project Overview

Grand Prix Playoffs is an independent, fan-made web application that restructures the F1 World Drivers' Championship into a NASCAR-style playoff format. Using official Grand Prix results, the season culminates in a winner-take-all final race among four drivers.

### The Philosophy

Grand Prix racing is at its best when everything is on the line. Grand Prix Playoffs is built on three principles:

- **Merit** — Reward performance across the season
- **Pressure** — Demand excellence when elimination is real
- **Finality** — Ensure the championship is decided at the final event

This is not a replacement for the official standings. It is a competitive alternative designed to amplify the drama already present in the sport.

---

## Playoff Format Specification

### Season Structure

The last 7 races of any F1 season constitute the playoffs. The remaining races form the regular season.

| Phase              | Races           | Drivers | Outcome                        |
| ------------------ | --------------- | ------- | ------------------------------ |
| Regular Season     | 1 through (N-7) | All     | Top 10 by points qualify       |
| Playoff Round 1    | (N-6) and (N-5) | 10      | Bottom 2 eliminated → 8 remain |
| Playoff Round 2    | (N-4) and (N-3) | 8       | Bottom 2 eliminated → 6 remain |
| Playoff Round 3    | (N-2) and (N-1) | 6       | Bottom 2 eliminated → 4 remain |
| Championship Final | N (last race)   | 4       | Winner takes title             |

_For a 24-race season: Regular season = races 1-17, Playoffs = races 18-24_

### Points System

All standard F1 points contribute to standings:

**Race Points (Top 10)**
| Position | 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th | 9th | 10th |
|----------|-----|-----|-----|-----|-----|-----|-----|-----|-----|------|
| Points | 25 | 18 | 15 | 12 | 10 | 8 | 6 | 4 | 2 | 1 |

**Sprint Points (Top 8)**
| Position | 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th |
|----------|-----|-----|-----|-----|-----|-----|-----|-----|
| Points | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 |

**Bonus Points**

- Pole Position: 1 point (driver who qualifies P1)
- Fastest Lap: 1 point (if driver finishes in top 10)

### Playoff Rules

1. **Qualification**: Top 10 drivers by regular season points advance to playoffs
2. **Point Reset**: All playoff drivers reset to 0 points at the START of EACH round (not cumulative)
3. **Round Scoring**: Each round sums points from its 2 races only
4. **Elimination**: Bottom 2 drivers by round points are eliminated after each round
5. **Final Race**: Single race among 4 remaining drivers; highest points wins championship
6. **Tiebreakers**: Follow official F1 countback rules (most wins, then most 2nds, etc.)
7. **Fastest Lap**: Only awarded if driver finishes in top 10 (per F1 rules)

### Edge Cases

- **Mid-season driver changes**: New driver starts fresh with 0 points (no inheritance)
- **Disqualifications**: Use official revised results from the API
- **Race cancellations**: Handled dynamically; playoffs always = last 7 completed races

---

## Technical Architecture

### Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Build Tool   | Vite                           |
| Framework    | React 18                       |
| Language     | TypeScript (strict mode)       |
| UI Library   | Material UI (MUI) v5           |
| Routing      | React Router v6                |
| Server State | TanStack Query v5              |
| Client State | Zustand                        |
| Styling      | Emotion (via MUI)              |
| Testing      | Vitest + React Testing Library |
| Linting      | ESLint + Prettier              |
| Icons        | Lucide React                   |
| Git Hooks    | Husky + lint-staged            |
| Hosting      | Cloudflare Pages               |
| Analytics    | Cloudflare Web Analytics       |
| Domain       | grandprixplayoffs.com          |

### Data Strategy

**Primary API: Jolpica-F1**

- Base URL: `https://api.jolpi.ca/ergast/f1/`
- Endpoints used:
  - `/{year}` - Season calendar
  - `/{year}/{round}/results` - Race results
  - `/{year}/{round}/qualifying` - Qualifying results (for pole)
  - `/{year}/{round}/sprint` - Sprint results
  - `/current/driverStandings` - Current standings
- Rate limits: 4 req/sec, 200 req/hour

**Backup API: OpenF1**

- Base URL: `https://api.openf1.org/v1/`
- Used when Jolpica is unavailable
- Also provides driver photos and team colors
- Endpoints used:
  - `/sessions` - Session info (race, qualifying, sprint)
  - `/meetings` - Grand Prix weekend calendar
  - `/session_result` - Final positions after sessions
  - `/drivers` - Driver info with headshots and team colors
  - `/championship_drivers` - Championship standings (beta)

**Fallback: Local JSON**

- Static JSON files mirroring API structure
- Manual update capability if both APIs fail

**Data Flow**

```
User Request → TanStack Query → Jolpica API
                                    ↓ (on error)
                               OpenF1 API
                                    ↓ (on error)
                               Local JSON
                                    ↓
                            Normalize Data
                                    ↓
                            Playoff Engine
                                    ↓
                               UI Render
```

### Project Structure

```
grand-prix-playoffs/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Buttons, cards, loaders
│   │   ├── standings/       # Standings tables, driver cards
│   │   ├── bracket/         # Playoff bracket visualization
│   │   └── layout/          # Header, footer, navigation
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── SeasonPage.tsx
│   │   └── AboutPage.tsx
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API clients
│   │   ├── jolpica.ts
│   │   ├── openf1.ts
│   │   └── api.ts           # Unified API layer
│   ├── engine/              # Playoff calculation logic
│   │   ├── playoffs.ts
│   │   ├── points.ts
│   │   └── standings.ts
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helper functions
│   ├── constants/           # Magic numbers, config
│   └── theme/               # MUI theme configuration
├── public/                  # Static assets
├── tests/                   # Test files
├── data/                    # Fallback JSON data
├── .husky/                  # Git hooks
├── .kiro/
│   └── steering/            # Kiro steering docs
└── docs/                    # Additional documentation
```

---

## UI/UX Design

### Design Principles

- **Mobile-first**: Primary audience views on phones
- **Clean & minimal**: Let the data speak
- **Bold**: Racing aesthetic without being garish
- **Fast**: Instant feedback, smooth transitions

### Theme

- Dark and light mode toggle
- High contrast for readability
- Accent colors for elimination states (red = eliminated, green = advancing)
- Team colors for driver identification

### Branding

- **Logo**: Text-based "Grand Prix Playoffs" in bold typography (v1)
- **Future**: Custom logo/icon to be commissioned post-launch

### Navigation

| Route    | Page   | Purpose                                           |
| -------- | ------ | ------------------------------------------------- |
| `/`      | Home   | Current/latest season standings + playoff bracket |
| `/2025`  | Season | 2025 completed season view                        |
| `/2026`  | Season | 2026 live season view                             |
| `/about` | About  | Philosophy, rules, format explanation             |

_Note: Home (`/`) shows 2025 until 2026 season begins, then switches to 2026_

### Season State Detection

The app auto-detects the current season state by comparing today's date against the race calendar:

| State          | Condition                     | Display                                  |
| -------------- | ----------------------------- | ---------------------------------------- |
| Pre-season     | Before race 1 date            | "Season starts [date]" + previous season |
| Regular Season | Between race 1 and race (N-7) | Current standings, races remaining       |
| Playoffs       | Between race (N-6) and race N | Playoff bracket, elimination status      |
| Completed      | After final race              | Final results, champion crowned          |

### Key UI Components

1. **Playoff Bracket** - Visual elimination bracket showing progression
2. **Standings Table** - Sortable driver standings with points breakdown
3. **Race Results Card** - Individual race results with playoff implications
4. **Season Timeline** - Visual indicator of regular season vs playoff phases
5. **Driver Card** - Photo, team, points, elimination status

---

## Implementation Plan

### Timeline: Feb 15 - Feb 28, 2026 (14 days)

### Phase 1: Foundation (Days 1-2)

> Project setup, tooling, basic structure

- [x] Initialize Vite + React + TypeScript project
- [x] Configure ESLint, Prettier, TypeScript strict mode
- [x] Set up Husky + lint-staged for pre-commit hooks
- [x] Install and configure MUI with custom theme (dark/light)
- [x] Install Lucide React for icons
- [x] Set up React Router with basic route structure
- [x] Create project folder structure
- [x] Initialize Git repository and push to GitHub
- [x] Create README.md, CONTRIBUTING.md, and LICENSE (MIT)
- [x] Set up Kiro steering docs for dev standards

### Phase 2: Data Layer (Days 3-5)

> API integration and playoff engine

- [x] Create TypeScript interfaces for F1 data (Driver, Race, Result, etc.)
- [x] Implement Jolpica API client
- [x] Implement OpenF1 API client (backup) - _Skipped: not needed, using static data instead_
- [x] Create unified API service with fallback logic
- [x] Set up TanStack Query with caching configuration
- [x] Implement playoff calculation engine:
  - [x] Regular season points aggregation
  - [x] Playoff qualification (top 10)
  - [x] Round-by-round elimination logic
  - [x] Championship final determination
- [x] Write unit tests for playoff engine
- [x] Validate playoff calculations against 2025 API data (completed season)

**Additional Phase 2 work completed:**

- [x] Static data caching system (pre-fetched JSON for instant loads)
- [x] Data fetch script (`scripts/fetch-season-data.mjs`)
- [x] GitHub Actions workflow for automated weekly data updates
- [x] Vite proxy configuration for local development (CORS workaround)
- [x] Rate limiting for Jolpica API (4 req/sec limit)
- [x] 2025 season data pre-cached in `data/2025.json`

**Technical notes:**

- Static data loads instantly; live API only used when static data unavailable
- GitHub Actions runs every Monday 6AM UTC to update current season data
- Driver info (names, teams) extracted from race results for display
- 31 unit tests covering points, standings, tiebreakers, and elimination logic

### Phase 3: Core UI (Days 6-9)

> Main views and components

- [x] Build layout components (Header, Footer, Navigation)
- [x] Implement responsive navigation (mobile hamburger menu)
- [x] Create Standings Table component
- [x] Create Driver Card component - _Implemented as DriverRow within StandingsTable_
- [x] Build Playoff Bracket visualization - _Deferred to future phase; table view sufficient for v1_
- [x] Implement Season Timeline component - _Deferred to future phase; status text sufficient for v1_
- [x] Build Home Page with current standings - _Placeholder for now; will finalize in later phase_
- [x] Build Season Page with race-by-race breakdown
- [x] Build About Page with philosophy content
- [x] Implement dark/light mode toggle
- [x] Add loading states and error handling

**Additional Phase 3 work completed:**

- [x] StandingsTable with expandable driver details (DriverRow, DriverDetail)
- [x] RaceCard component showing position and full points breakdown (R, S, P, FL)
- [x] PhaseSection component grouping races by playoff round
- [x] Team color stripes for driver identification
- [x] Trophy icons for podium positions (gold/silver/bronze)
- [x] "Did Not Make Playoffs" banner separating qualifiers from non-qualifiers
- [x] Ghost styling for races after elimination (muted, dashed borders)
- [x] Bright coral red ✗ for elimination markers
- [x] 3-letter driver codes on mobile, full names on desktop
- [x] Table max-width constrained to ~800px on desktop, centered
- [x] Responsive race card grid (3 cols mobile, 4 tablet, 5 desktop)

**Design decisions:**

- Removed expand/collapse chevron icons for cleaner look (rows still clickable)
- Points breakdown colors: Gray (race), Blue (sprint), Yellow (pole), Purple (fastest lap)
- Purple for fastest lap matches F1's official fastest lap/sector color
- Hover effects only on devices that support hover (fixes mobile sticky highlight)
- Sorting: Champion → Finalists → R3 eliminated → R2 eliminated → R1 eliminated → Did Not Advance

### Phase 4: Polish & Integration (Days 10-12)

> Connect everything, refine UX

- [x] Integrate 2025 season data via API
- [x] Verify playoff calculations match expected results
- [x] Add season auto-detection (regular season vs playoffs vs completed)
- [x] Implement season selector dropdown - _Simplified: direct nav links instead of dropdown_
- [x] Add animations and transitions - _Minimal: Collapse animation on driver detail expand_
- [x] Mobile responsiveness testing and fixes
- [x] Cross-browser testing
- [x] Performance optimization (lazy loading, code splitting) - _Static data caching approach_
- [x] Accessibility review (keyboard nav, screen readers, contrast)

**Additional Phase 4 work completed:**

- [x] WCAG AA color contrast fixes for both light/dark modes (palette.ts)
- [x] Mode-aware colors for trophies, points breakdown, elimination markers
- [x] Trophy display logic: only show for completed seasons
- [x] Season status detection prioritizes completed race count over dates
- [x] HomePage with hero section, tagline, and embedded 2026 standings
- [x] AboutPage rewritten with full format explanation, points system, tiebreakers
- [x] PlayoffExplainer component (collapsible, localStorage persistence)
- [x] SeasonPage status text: contextual messages for each season state
- [x] "Did Not Advance to Playoffs" banner styled italic
- [x] Format breakdown on About page: simplified two-column layout (no table)
- [x] All magic numbers replaced with constants from src/constants/
- [x] CURRENT_SEASON constant added to config.ts
- [x] ESLint, TypeScript, Prettier all passing
- [x] 31 unit tests passing

**Design decisions:**

- 2026 data left empty, waiting for real API data when season starts
- Explainer is collapsible (not permanently dismissible) for better UX
- Homepage copy: "The F1 championship, reimagined" tagline with clear value prop
- Hero buttons sized medium for better visual hierarchy

### Phase 5: Deployment (Days 13-14)

> Go live

- [ ] Set up Cloudflare Pages project
- [ ] Configure GitHub integration for auto-deploy
- [ ] Set up grandprixplayoffs.com domain
- [ ] Configure SSL and DNS
- [ ] Enable Cloudflare Web Analytics
- [ ] Final production testing
- [ ] Create fallback JSON data for 2025 season
- [ ] Write deployment documentation
- [ ] Launch! 🏁

---

## Development Standards

### Code Style

- **TypeScript**: Strict mode, no `any` types, explicit return types on functions
- **Components**: Functional components with hooks only
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Files**: One component per file, named same as component
- **Imports**: Absolute imports from `src/`, organized by type

### Commit Conventions

```
type(scope): description

feat(engine): add playoff elimination logic
fix(api): handle rate limit errors gracefully
docs(readme): update installation instructions
style(standings): improve mobile layout
refactor(hooks): extract useSeasonData hook
test(engine): add tiebreaker edge case tests
```

### PR Checklist

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] Tests pass
- [ ] Mobile responsive
- [ ] No console errors/warnings

### Constants (No Magic Numbers)

```typescript
// src/constants/points.ts
export const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1];
export const POLE_POSITION_POINTS = 1;
export const FASTEST_LAP_POINTS = 1;

// src/constants/playoffs.ts
export const PLAYOFF_RACES = 7;
export const PLAYOFF_QUALIFIERS = 10;
export const ELIMINATIONS_PER_ROUND = 2;
export const FINAL_DRIVERS = 4;
```

---

## Future Considerations

These are explicitly out of scope for v1 but documented for future reference:

- **Fantasy Grand Prix Playoffs**: User accounts, fantasy teams, leagues
- **Historical seasons**: Pre-2025 data analysis
- **Push notifications**: Race result alerts
- **Social sharing**: Share standings/brackets
- **Constructors playoff**: Team-based elimination format
- **API caching layer**: Cloudflare Workers for reduced API calls

---

## Resources

- **Jolpica-F1 API**: https://api.jolpi.ca/ergast/f1/
- **OpenF1 API**: https://openf1.org/docs
- **MUI Documentation**: https://mui.com/
- **TanStack Query**: https://tanstack.com/query
- **Cloudflare Pages**: https://pages.cloudflare.com/

---

## Legal Disclaimer

Grand Prix Playoffs is an independent fan project and is not affiliated with, endorsed by, or associated with Formula One Group, the FIA, or Formula 1. All F1-related trademarks belong to their respective owners.

---

_Document created: February 15, 2026_
_Target launch: February 28, 2026_
