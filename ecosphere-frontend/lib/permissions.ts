import { Role } from '../context/AuthContext';

export type AccessLevel =
  | 'full'
  | 'view'
  | 'join'
  | 'redeem'
  | 'read_acknowledge'
  | 'manage'
  | 'personal'
  | 'none';

export type Feature =
  | 'dashboard'
  | 'emission_factors'
  | 'carbon_transactions'
  | 'environmental_goals'
  | 'csr_activities'
  | 'approve_csr'
  | 'policies'
  | 'audits'
  | 'compliance_issues'
  | 'challenges'
  | 'challenge_approval'
  | 'badges'
  | 'rewards'
  | 'leaderboard'
  | 'reports'
  | 'departments'
  | 'user_management'
  | 'esg_configuration'
  | 'notification_settings';

// Route-level features (used for sidebar filtering)
export type RouteFeature =
  | 'dashboard'
  | 'environmental'
  | 'social'
  | 'governance'
  | 'gamification'
  | 'reports'
  | 'settings'
  | 'profile';

const permissionsMatrix: Record<Feature, Record<Role, AccessLevel>> = {
  dashboard:              { admin: 'full',    employee: 'personal' },
  emission_factors:       { admin: 'full',    employee: 'none' },
  carbon_transactions:    { admin: 'full',    employee: 'none' },
  environmental_goals:    { admin: 'full',    employee: 'view' },
  csr_activities:         { admin: 'full',    employee: 'join' },
  approve_csr:            { admin: 'full',    employee: 'none' },
  policies:               { admin: 'full',    employee: 'read_acknowledge' },
  audits:                 { admin: 'full',    employee: 'none' },
  compliance_issues:      { admin: 'full',    employee: 'none' },
  challenges:             { admin: 'full',    employee: 'join' },
  challenge_approval:     { admin: 'full',    employee: 'none' },
  badges:                 { admin: 'manage',  employee: 'view' },
  rewards:                { admin: 'manage',  employee: 'redeem' },
  leaderboard:            { admin: 'full',    employee: 'full' },
  reports:                { admin: 'full',    employee: 'none' },
  departments:            { admin: 'full',    employee: 'none' },
  user_management:        { admin: 'full',    employee: 'none' },
  esg_configuration:      { admin: 'full',    employee: 'none' },
  notification_settings:  { admin: 'full',    employee: 'none' },
};

// Which routes each role can see in sidebar
const routeAccess: Record<RouteFeature, Record<Role, boolean>> = {
  dashboard:     { admin: true,  employee: true },
  environmental: { admin: true,  employee: false },
  social:        { admin: true,  employee: true },
  governance:    { admin: true,  employee: true },
  gamification:  { admin: true,  employee: true },
  reports:       { admin: true,  employee: true },
  settings:      { admin: true,  employee: true },
  profile:       { admin: true,  employee: true },
};

export function canAccess(role: Role, feature: Feature): boolean {
  return permissionsMatrix[feature][role] !== 'none';
}

export function getAccessLevel(role: Role, feature: Feature): AccessLevel {
  return permissionsMatrix[feature][role];
}

export function canAccessRoute(role: Role, route: RouteFeature): boolean {
  return routeAccess[route][role];
}

// Map route paths to RouteFeature names
const pathToRoute: Record<string, RouteFeature> = {
  '/dashboard': 'dashboard',
  '/environmental': 'environmental',
  '/social': 'social',
  '/governance': 'governance',
  '/gamification': 'gamification',
  '/reports': 'reports',
  '/settings': 'settings',
  '/profile': 'profile',
};

export function canAccessPath(role: Role, path: string): boolean {
  const normalizedPath = path.replace(/^\/(admin|user)/, '');
  const route = pathToRoute[normalizedPath] || pathToRoute[path];
  if (!route) return true; // unknown routes are allowed
  return canAccessRoute(role, route);
}
