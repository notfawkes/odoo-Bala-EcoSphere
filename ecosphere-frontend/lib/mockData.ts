import { Activity, Department, Metric, Notification } from '../types';

export const metrics: Metric[] = [
{
  label: 'Environmental score',
  value: '84',
  change: '+6.4% vs Q1',
  tone: 'leaf'
},
{ label: 'Social score', value: '78', change: '+3.2% vs Q1', tone: 'lime' },
{
  label: 'Governance score',
  value: '91',
  change: '+2.1% vs Q1',
  tone: 'olive'
},
{
  label: 'Overall ESG score',
  value: '84',
  change: 'Top 12% in sector',
  tone: 'dark'
}];


export const departments: Department[] = [
{
  name: 'Operations',
  score: 91,
  emissions: 284,
  trend: -12,
  lead: 'Maya Chen'
},
{ name: 'Product', score: 86, emissions: 176, trend: -8, lead: 'Ari Gomez' },
{ name: 'People', score: 82, emissions: 64, trend: -4, lead: 'Jordan Lee' },
{ name: 'Finance', score: 77, emissions: 118, trend: 3, lead: 'Toni Burke' }];


export const emissions = [
{ month: 'Jan', value: 520 },
{ month: 'Feb', value: 495 },
{ month: 'Mar', value: 472 },
{ month: 'Apr', value: 448 },
{ month: 'May', value: 431 },
{ month: 'Jun', value: 398 }];


export const distribution = [
{ name: 'Environmental', value: 84, fill: '#499A13' },
{ name: 'Social', value: 78, fill: '#8ECA3C' },
{ name: 'Governance', value: 91, fill: '#BBDC12' }];


export const activities: Activity[] = [
{
  title: 'Q2 carbon inventory approved',
  detail: 'Operations • 18.4 tCO₂e verified',
  time: '18 min ago',
  kind: 'carbon'
},
{
  title: 'Green commute challenge launched',
  detail: 'People • 148 employees enrolled',
  time: '2 hrs ago',
  kind: 'reward'
},
{
  title: 'Code of conduct acknowledgement',
  detail: 'Governance • 32 acknowledgements pending',
  time: 'Yesterday',
  kind: 'governance'
},
{
  title: 'STEM mentorship program completed',
  detail: 'Social • 42 community hours logged',
  time: 'Yesterday',
  kind: 'social'
}];


export const notifications: Notification[] = [
{
  title: 'Compliance evidence due',
  description: 'Supplier review evidence is due in 2 days.',
  time: 'Now',
  category: 'Compliance',
  unread: true
},
{
  title: 'CSR activity awaiting approval',
  description: 'Food bank volunteer day needs your review.',
  time: '1h',
  category: 'Social',
  unread: true
},
{
  title: 'New badge unlocked',
  description: 'You earned the Circular Thinker badge.',
  time: '3h',
  category: 'Rewards',
  unread: true
},
{
  title: 'Policy reminder',
  description: 'Please acknowledge the updated travel policy.',
  time: 'Yesterday',
  category: 'Governance',
  unread: false
}];


export const transactions = [
['TRX-1048', 'Operations', 'Electricity — London', '48.2 tCO₂e', 'Verified'],
['TRX-1047', 'Product', 'Cloud infrastructure', '32.8 tCO₂e', 'In review'],
['TRX-1046', 'Finance', 'Business travel', '18.4 tCO₂e', 'Verified'],
['TRX-1045', 'People', 'Office waste', '6.7 tCO₂e', 'Draft']];


export const policies = [
['POL-012', 'Responsible Procurement', '94%', 'Annual review', 'On track'],
[
'POL-008',
'Data Ethics & Privacy',
'87%',
'Acknowledgement',
'Needs review'],

['POL-005', 'Anti-Bribery & Corruption', '100%', 'Annual review', 'Complete']];


export const challenges = [
{
  title: 'Low carbon commute',
  description: 'Choose a cleaner route for 10 days.',
  progress: 72,
  participants: 148,
  xp: 450,
  color: '#499A13'
},
{
  title: 'Waste-less week',
  description: 'Bring reusable items to work.',
  progress: 48,
  participants: 92,
  xp: 300,
  color: '#8ECA3C'
},
{
  title: 'Community hours',
  description: 'Log time for a local cause.',
  progress: 84,
  participants: 65,
  xp: 600,
  color: '#BBDC12'
}];


export const reports = [
['Environmental Performance', 'Quarterly', '18 Jun 2026', 'Ready'],
['Social Impact & Engagement', 'Quarterly', '16 Jun 2026', 'Ready'],
['Governance & Compliance', 'Monthly', '02 Jun 2026', 'Ready'],
['FY26 ESG Summary', 'Annual', 'In preparation', 'Draft']];