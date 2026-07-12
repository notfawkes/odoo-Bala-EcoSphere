"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  ArrowUpRightIcon,
  AwardIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  DownloadIcon,
  LeafIcon,
  PlusIcon,
  SparklesIcon,
  TrophyIcon
} from 'lucide-react';
import {
  activities,
  challenges,
  departments,
  distribution,
  emissions,
  metrics
} from '@/lib/mockData';
import {
  Button,
  Card,
  PageHeader,
  ProgressBar
} from '@/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel } from '@/lib/permissions';

const iconMap = {
  carbon: LeafIcon,
  social: CircleCheckIcon,
  governance: CircleCheckIcon,
  reward: SparklesIcon
};

// Employee personal dashboard
function EmployeeDashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="Personal workspace"
        title="HEY, JORDAN."
        description="Your personal ESG contribution and sustainability progress."
        action={
          <Button variant="secondary">
            <DownloadIcon size={16} /> My report
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Personal ESG score', value: '72', change: '+4.2 this month', tone: 'dark' as const },
          { label: 'Reward points', value: '1,280', change: '320 redeemable', tone: 'leaf' as const },
          { label: 'Challenges joined', value: '5', change: '2 active', tone: 'lime' as const },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <Card className={`relative overflow-hidden p-5 ${metric.tone === 'dark' ? 'bg-[#244E18] text-white' : ''}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${metric.tone === 'dark' ? 'text-[#D5E6C9]' : 'text-[#74816f] dark:text-[#8A9687]'}`}>
                {metric.label}
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className={`font-display text-6xl leading-none ${metric.tone === 'dark' ? '' : 'text-[#24421c] dark:text-[#C8E6B8]'}`}>
                  {metric.value}
                </p>
                <span className={`mb-1 rounded-full px-2 py-1 text-[11px] font-bold ${metric.tone === 'dark' ? 'bg-[#3b6e27] text-[#e3f2d8]' : 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]'}`}>
                  {metric.change}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        {/* Active challenges */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Your active challenges</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Join challenges to earn XP
              </p>
            </div>
            <TrophyIcon className="text-[#8ECA3C]" size={20} />
          </div>
          <div className="mt-4 space-y-3">
            {challenges.map((c) => (
              <div
                className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]"
                key={c.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold dark:text-[#E8F0E4]">{c.title}</p>
                    <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">{c.description}</p>
                  </div>
                  <span className="rounded-full bg-[#F3F8EF] px-2 py-1 text-xs font-bold text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                    +{c.xp} XP
                  </span>
                </div>
                <div className="mt-3">
                  <div className="mb-2 flex justify-between text-xs text-[#758171] dark:text-[#6B7B67]">
                    <span>{c.participants} participants</span>
                    <span>{c.progress}%</span>
                  </div>
                  <ProgressBar value={c.progress} color={c.color} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Your badges</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Recognition earned through action
              </p>
            </div>
            <SparklesIcon className="text-[#8ECA3C]" size={20} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Circular Thinker', 'Waste-less week'],
              ['Community Builder', '50 volunteer hours'],
              ['Carbon Conscious', 'Low-carbon commute']
            ].map(([badge, detail]) => (
              <div
                className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]"
                key={badge}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EAF5E4] text-[#499A13] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                  <AwardIcon size={17} />
                </span>
                <p className="mt-4 text-sm font-bold dark:text-[#E8F0E4]">{badge}</p>
                <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">{detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Your recent activity</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Your contributions to sustainability
              </p>
            </div>
            <button className="rounded-lg p-1 text-[#397B14] dark:text-[#8ECA3C]">
              <ChevronRightIcon size={18} />
            </button>
          </div>
          <div className="mt-4 divide-y divide-[#EEF3EB] dark:divide-[#1E3319]">
            {[
              'Completed Low carbon commute challenge',
              'Logged 6 hours at food bank volunteer day',
              'Acknowledged updated travel policy',
              'Earned Circular Thinker badge'
            ].map((item, i) => (
              <div className="flex gap-3 py-3" key={item}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#EAF5E4] text-[#499A13] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                  <CircleCheckIcon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#3A4936] dark:text-[#C8E6B8]">
                    {item}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#7A8577] dark:text-[#6B7B67]">
                    {i + 1} day{i ? 's' : ''} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

// Full org dashboard (Admin / ESG Manager)
function OrgDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader
        eyebrow="Executive workspace"
        title={`GOOD MORNING, ${user.name.split(' ')[0].toUpperCase()}.`}
        description="Here is the pulse of Aster & Co.'s sustainability performance."
        action={
          <Button>
            <DownloadIcon size={16} /> Export snapshot
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <Card className={`relative overflow-hidden p-5 ${metric.tone === 'dark' ? 'bg-[#244E18] text-white' : ''}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${metric.tone === 'dark' ? 'text-[#D5E6C9]' : 'text-[#74816f] dark:text-[#8A9687]'}`}>
                {metric.label}
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className={`font-display text-6xl leading-none ${metric.tone === 'dark' ? '' : 'text-[#24421c] dark:text-[#C8E6B8]'}`}>
                  {metric.value}
                </p>
                <span className={`mb-1 rounded-full px-2 py-1 text-[11px] font-bold ${metric.tone === 'dark' ? 'bg-[#3b6e27] text-[#e3f2d8]' : 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]'}`}>
                  {metric.change}
                </span>
              </div>
              <div className={`mt-5 h-1.5 rounded-full ${metric.tone === 'dark' ? 'bg-[#48773a]' : 'bg-[#EAF2E5] dark:bg-[#1E3319]'}`}>
                <motion.div
                  className="h-full rounded-full bg-[#8ECA3C]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Number(metric.value)}%` }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.8 }}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Card className="p-5">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Carbon emissions trend</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                tCO₂e across managed operations
              </p>
            </div>
            <span className="rounded-lg bg-[#EAF5E4] px-2 py-1 text-xs font-bold text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
              −23.5%
            </span>
          </div>
          <div className="h-[250px]" aria-label="Carbon emissions trend chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emissions}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#7A8577' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#7A8577' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E6EFE0',
                    backgroundColor: 'var(--tooltip-bg, white)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#499A13"
                  strokeWidth={3}
                  fill="#8ECA3C"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-base font-bold dark:text-[#E8F0E4]">ESG score distribution</h2>
          <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
            Balanced across core pillars
          </p>
          <div className="relative mt-2 h-[210px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={5}
                >
                  {distribution.map((e) => (
                    <Cell fill={e.fill} key={e.name} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-5xl leading-none text-[#24421c] dark:text-[#C8E6B8]">
                  84
                </p>
                <p className="text-[10px] font-bold uppercase text-[#758171] dark:text-[#6B7B67]">
                  Overall
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {distribution.map((d) => (
              <div
                className="flex items-center gap-1.5 text-[11px] text-[#667462] dark:text-[#8A9687]"
                key={d.name}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: d.fill }}
                />
                {d.name.slice(0, 3)}
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Department ESG ranking</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Score against quarterly target
              </p>
            </div>
            <button className="text-xs font-bold text-[#397B14] dark:text-[#8ECA3C]">
              View all
            </button>
          </div>
          <div className="mt-5 h-[255px]">
            <ResponsiveContainer>
              <BarChart
                data={departments}
                layout="vertical"
                margin={{ left: 15 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#566352' }}
                />
                <Tooltip
                  cursor={{ fill: '#F4F8F1' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E6EFE0'
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#499A13"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Recent activity</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Movement across your workspace
              </p>
            </div>
            <button className="rounded-lg p-1 text-[#397B14] dark:text-[#8ECA3C]">
              <ChevronRightIcon size={18} />
            </button>
          </div>
          <div className="mt-4 divide-y divide-[#EEF3EB] dark:divide-[#1E3319]">
            {activities.map((a) => {
              // @ts-ignore
              const Icon = iconMap[a.kind];
              return (
                <div className="flex gap-3 py-3" key={a.title}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#EAF5E4] text-[#499A13] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#3A4936] dark:text-[#C8E6B8]">
                      {a.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#7A8577] dark:text-[#6B7B67]">
                      {a.detail}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-[11px] text-[#8A9687] dark:text-[#6B7B67]">
                    {a.time}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-[#E8F0E4]">Department performance</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Current score and emission trend
              </p>
            </div>
            <Button variant="ghost" className="h-8 text-xs">
              Open overview <ArrowUpRightIcon size={14} />
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {departments.map((d) => (
              <div
                className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]"
                key={d.name}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-[#3C4C38] dark:text-[#C8E6B8]">{d.name}</p>
                    <p className="mt-1 text-xs text-[#778473] dark:text-[#6B7B67]">{d.lead}</p>
                  </div>
                  <p className="font-display text-4xl text-[#315b23] dark:text-[#8ECA3C]">
                    {d.score}
                  </p>
                </div>
                <div className="mt-4">
                  <ProgressBar value={d.score} />
                  <p
                    className={`mt-2 text-xs font-semibold ${d.trend < 0 ? 'text-[#397B14] dark:text-[#8ECA3C]' : 'text-[#B36B00] dark:text-[#F0B429]'}`}
                  >
                    {d.trend < 0 ? '↓' : '↑'} {Math.abs(d.trend)}% emissions vs last period
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-[#F0F7EB] p-5 dark:bg-[#1A2D16]">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#499A13] dark:bg-[#162212] dark:text-[#8ECA3C]">
            <PlusIcon size={19} />
          </span>
          <h2 className="mt-5 text-lg font-bold dark:text-[#E8F0E4]">Turn insight into action</h2>
          <p className="mt-2 text-sm leading-6 text-[#647060] dark:text-[#8A9687]">
            Your supplier evidence review is nearly complete.
          </p>
          <Button className="mt-5 w-full">Review evidence</Button>
        </Card>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useAuth();
  const access = getAccessLevel(role, 'dashboard');

  if (access === 'personal') {
    return <EmployeeDashboard />;
  }

  return <OrgDashboard />;
}
