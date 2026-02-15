# Contributing to Grand Prix Playoffs

Thank you for your interest in contributing to Grand Prix Playoffs! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/grand-prix-playoffs.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## Code Standards

Please follow the development standards outlined in `.kiro/steering/dev-standards.md`. Key points:

- **TypeScript**: Use strict mode, no `any` types, explicit return types
- **Components**: Functional components only, one per file, under 200 lines
- **Styling**: Use MUI's `sx` prop with theme values, mobile-first approach
- **Constants**: No magic numbers - define in `src/constants/`

## Commit Messages

We use conventional commits:

```
type(scope): description

feat(engine): add playoff elimination logic
fix(api): handle rate limit errors
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add tests for new functionality
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Create a pull request with a clear description

## PR Checklist

- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] Tests pass
- [ ] Mobile responsive
- [ ] No console errors/warnings

## Questions?

Feel free to open an issue for questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
