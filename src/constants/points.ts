// F1 Points System Constants

// Race points for positions 1-10
export const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const;

// Sprint race points for positions 1-8
export const SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

// Bonus points
export const POLE_POSITION_POINTS = 1;
export const FASTEST_LAP_POINTS = 1;

// Number of positions that score points
export const RACE_POINTS_POSITIONS = 10;
export const SPRINT_POINTS_POSITIONS = 8;

// Fastest lap eligibility (must finish in top N)
export const FASTEST_LAP_ELIGIBILITY_POSITION = 10;
