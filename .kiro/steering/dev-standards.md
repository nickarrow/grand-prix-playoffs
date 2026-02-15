---
inclusion: always
---

# Development Standards

These standards apply to all code in the Grand Prix Playoffs project.

## TypeScript

- Use strict mode (enabled in tsconfig.json)
- No `any` types - use proper typing or `unknown` with type guards
- Explicit return types on all functions
- Use interfaces for object shapes, types for unions/primitives
- Prefer `const` over `let`, never use `var`

## React Components

- Functional components with hooks only (no class components)
- One component per file, filename matches component name
- Use PascalCase for component names
- Keep components under 200 lines - split if larger
- Extract reusable logic into custom hooks

## Code Organization

- Use absolute imports from `src/` (e.g., `import { Button } from 'src/components/common'`)
- Organize imports: React first, external libs, internal modules, types, styles
- Group related files in feature folders
- Keep utility functions pure when possible

## Naming Conventions

- PascalCase: Components, interfaces, types, enums
- camelCase: Functions, variables, hooks (prefix with `use`)
- SCREAMING_SNAKE_CASE: Constants
- kebab-case: File names for non-components (utils, constants)

## No Magic Numbers

All numeric constants must be defined in `src/constants/`:

```typescript
// ❌ Bad
if (position <= 10) { ... }
const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// ✅ Good
import { POINTS_POSITIONS, RACE_POINTS } from 'src/constants/points';
if (position <= POINTS_POSITIONS) { ... }
```

## DRY Principles

- Extract repeated code into utility functions or hooks
- If you copy-paste code more than once, refactor it
- Share types across files via `src/types/`
- Use component composition over prop drilling

## File Size Limits

- Components: ~200 lines max
- Utility files: ~150 lines max
- If a file grows too large, split by responsibility
- Each file should have a single, clear purpose

## Error Handling

- Always handle API errors gracefully
- Use try/catch for async operations
- Provide user-friendly error messages
- Log errors for debugging (console.error in dev)

## Testing

- Test playoff calculation logic thoroughly
- Use descriptive test names: `it('should eliminate bottom 2 drivers after round')`
- Test edge cases: ties, DNFs, mid-season driver changes
- Keep tests focused and independent

## Accessibility

- Use semantic HTML elements
- Include alt text for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers when possible

## Git Commits

Follow conventional commit format:

```
type(scope): description

feat(engine): add playoff elimination logic
fix(api): handle rate limit errors gracefully
docs(readme): update installation instructions
style(standings): improve mobile layout
refactor(hooks): extract useSeasonData hook
test(engine): add tiebreaker edge case tests
chore(deps): update MUI to v5.15
```

## PR Checklist

Before merging any code:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] Tests pass
- [ ] Mobile responsive
- [ ] No console errors/warnings in browser
- [ ] Reviewed for DRY violations
- [ ] No magic numbers introduced

## MUI & Styling

- Use MUI's `sx` prop for one-off styles
- Use `styled()` for reusable styled components
- Define colors, spacing, typography in theme - don't hardcode
- Mobile-first: start with mobile styles, add `sm`/`md`/`lg` breakpoints for larger screens

```typescript
// ❌ Bad - hardcoded values, desktop-first
<Box sx={{ width: 800, padding: '24px', color: '#ff0000' }}>

// ✅ Good - theme values, mobile-first
<Box sx={{ 
  width: { xs: '100%', md: 800 }, 
  p: 3, 
  color: 'error.main' 
}}>
```

## Data Fetching (TanStack Query)

- Query keys should be arrays: `['races', year, round]`
- Use query key factories for consistency
- Handle loading, error, and empty states in every component that fetches
- Set appropriate `staleTime` for F1 data (results don't change often)

```typescript
// Query key factory pattern
export const raceKeys = {
  all: ['races'] as const,
  season: (year: number) => [...raceKeys.all, year] as const,
  detail: (year: number, round: number) => [...raceKeys.season(year), round] as const,
};
```

## State Management

Use the right tool for the job:

| Data Type | Tool | Example |
|-----------|------|---------|
| Server/API data | TanStack Query | Race results, standings |
| Global UI state | Zustand | Selected season, theme mode |
| Local UI state | useState | Form inputs, open/closed modals |
| Derived data | Computed in render | Filtered lists, calculations |

Don't put server data in Zustand - let TanStack Query manage it.

## Environment Variables

- Prefix with `VITE_` for client-side access
- Define in `.env.local` (not committed)
- Provide `.env.example` with placeholder values
- Access via `import.meta.env.VITE_*`

```typescript
// src/constants/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.jolpi.ca/ergast/f1';
```

## Common LLM Pitfalls to Avoid

When working with AI assistance, watch for:

- **DRY violations**: Don't accept repeated code blocks
- **Overly long files**: Request splits if files exceed limits
- **Magic numbers**: Always ask for constants
- **Missing error handling**: Ensure all async code has error handling
- **Incomplete types**: Don't accept `any` or missing type definitions
- **Desktop-first styles**: Always start mobile, scale up
- **Inline colors/spacing**: Use theme tokens instead
