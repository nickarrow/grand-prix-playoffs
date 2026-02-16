# Grand Prix Playoffs

> Reimagining the Formula 1 Drivers' Championship as a true elimination battle.

Grand Prix Playoffs is an independent, fan-made web application that restructures the F1 World Drivers' Championship into a playoff format. Using official Grand Prix results, the season culminates in a winner-take-all final race among four drivers.

## Features

- **Playoff Format**: Top 10 drivers advance, elimination rounds narrow to 4 finalists
- **Live Data**: Automatic race results via F1 APIs
- **Season Tracking**: Follow 2025 (historical) and 2026 (live) seasons
- **Mobile-First**: Responsive design for all devices
- **Dark/Light Mode**: Toggle between themes

## Tech Stack

- React 18 + TypeScript
- Material UI
- TanStack Query
- Vite
- Cloudflare Pages

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # UI components
├── pages/          # Route pages
├── engine/         # Playoff calculation logic
├── services/       # API clients
├── store/          # Zustand state
├── theme/          # MUI theme
├── constants/      # Configuration
└── types/          # TypeScript types
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Disclaimer

Grand Prix Playoffs is an independent fan project and is not affiliated with, endorsed by, or associated with Formula One Group, the FIA, or Formula 1.
