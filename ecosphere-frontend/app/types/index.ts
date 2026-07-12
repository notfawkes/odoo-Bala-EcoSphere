export type Status =
'On track' |
'At risk' |
'Needs review' |
'Complete' |
'Open' |
'Closed';

export interface Department {
  name: string;
  score: number;
  emissions: number;
  trend: number;
  lead: string;
}

export interface Activity {
  title: string;
  detail: string;
  time: string;
  kind: 'carbon' | 'social' | 'governance' | 'reward';
}

export interface Notification {
  title: string;
  description: string;
  time: string;
  category: string;
  unread: boolean;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  tone: 'leaf' | 'lime' | 'olive' | 'dark';
}