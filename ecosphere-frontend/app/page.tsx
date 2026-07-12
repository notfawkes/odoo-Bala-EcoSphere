"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  LeafIcon,
  MoonIcon,
  ShieldCheckIcon,
  SunIcon,
  UsersIcon
} from 'lucide-react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui/Primitives';
import { useTheme } from '@/context/ThemeContext';

const features = [
  [
    LeafIcon,
    'Environmental intelligence',
    'Turn activity data into emission clarity, targets, and a credible reduction plan.'
  ],
  [
    UsersIcon,
    'People-powered impact',
    'Bring employee participation, CSR, and inclusion metrics into one connected view.'
  ],
  [
    ShieldCheckIcon,
    'Confident governance',
    'Keep policy obligations, audit readiness, and evidence in a consistent operating rhythm.'
  ]
];

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7FAF5] text-[#1B1B1B] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-3xl tracking-wide text-[#24421c] dark:text-[#C8E6B8]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#499A13] text-white">
            <LeafIcon size={19} />
          </span>
          ECOSPHERE
        </Link>
        <nav className="hidden gap-7 text-sm font-semibold text-[#566352] dark:text-[#8A9687] md:flex">
          <a href="#platform">Platform</a>
          <a href="#workflow">How it works</a>
          <a href="#impact">Impact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="grid h-10 w-10 place-items-center rounded-xl text-[#566352] hover:bg-white dark:text-[#8A9687] dark:hover:bg-[#1A2D16]"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon size={19} /> : <MoonIcon size={19} />}
          </button>
          <Link href="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
        </div>
      </header>
      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#499A13] dark:text-[#8ECA3C]"
            >
              Sustainability, operationalized
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-xl font-display text-6xl leading-[.84] tracking-wide sm:text-7xl lg:text-8xl"
            >
              GROW A BUSINESS THAT GIVES BACK.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-7 max-w-xl text-lg leading-8 text-[#647060] dark:text-[#8A9687]"
            >
              EcoSphere integrates sustainability into everyday business—so every team can make informed, accountable progress.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/login">
                <Button className="px-5">
                  Explore your workspace <ArrowRightIcon size={16} />
                </Button>
              </Link>
              <a href="#workflow">
                <Button variant="secondary">See how it works</Button>
              </a>
            </motion.div>
            <div className="mt-12 flex gap-8 border-t border-[#DDE8D6] pt-6 dark:border-[#1E3319]">
              <div>
                <p className="font-display text-4xl text-[#346f14] dark:text-[#8ECA3C]">42%</p>
                <p className="text-xs text-[#6B7280] dark:text-[#6B7B67]">faster reporting cycles</p>
              </div>
              <div>
                <p className="font-display text-4xl text-[#346f14] dark:text-[#8ECA3C]">3.1×</p>
                <p className="text-xs text-[#6B7280] dark:text-[#6B7B67]">more participation</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.14, duration: 0.5 }}
            className="relative rounded-[2rem] border border-[#D7E8CE] bg-[#EAF5E4] p-5 shadow-[0_24px_60px_rgba(56,104,33,.13)] dark:border-[#1E3319] dark:bg-[#1A2D16] dark:shadow-[0_24px_60px_rgba(0,0,0,.3)]"
          >
            <div className="rounded-2xl bg-[#244E18] p-6 text-white">
              <div className="mb-10 flex justify-between text-xs text-[#D5E6C9]">
                <span>FY26 ESG PERFORMANCE</span>
                <span>Updated today</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-7xl leading-none">84</p>
                  <p className="mt-2 text-sm text-[#D5E6C9]">Overall ESG score</p>
                </div>
                <div className="rounded-xl bg-[#5DA726] px-3 py-2 text-xs font-bold">
                  +6.4% this quarter
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['ENV', '84'],
                ['SOC', '78'],
                ['GOV', '91']
              ].map(([a, b]) => (
                <div key={a} className="rounded-xl bg-white p-4 dark:bg-[#162212]">
                  <p className="text-[10px] font-bold tracking-wider text-[#83907F] dark:text-[#6B7B67]">{a}</p>
                  <p className="mt-2 font-display text-4xl text-[#315b23] dark:text-[#8ECA3C]">{b}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-[#EAF2E5] dark:bg-[#1E3319]">
                    <div className="h-full rounded-full bg-[#7BBF34]" style={{ width: `${b}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/70 bg-white/75 p-4 dark:border-[#1E3319] dark:bg-[#162212]/80">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#42523D] dark:text-[#C8E6B8]">Carbon target</p>
                <p className="text-sm font-bold text-[#499A13] dark:text-[#8ECA3C]">68%</p>
              </div>
              <div className="mt-3 flex h-12 items-end gap-1.5">
                {[35, 45, 42, 58, 63, 75, 83, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-[#499A13]"
                    style={{ height: `${h}%`, opacity: 0.4 + i / 16 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>
        <section id="platform" className="border-y border-[#E6EFE0] bg-white py-20 dark:border-[#1E3319] dark:bg-[#111E0E]">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#499A13] dark:text-[#8ECA3C]">
              One operating system
            </p>
            <h2 className="mt-3 max-w-xl font-display text-5xl leading-none tracking-wide">
              ESG MANAGEMENT, WITHOUT THE SPREADSHEETS.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map(([Icon, title, copy], i) => (
                <motion.div whileHover={{ y: -5 }} key={title as string}>
                  <Card className="h-full p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EAF5E4] text-[#499A13] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                      {/* @ts-ignore */}
                      <Icon size={21} />
                    </span>
                    <h3 className="mt-6 text-lg font-bold dark:text-[#E8F0E4]">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6B7280] dark:text-[#8A9687]">{copy as string}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#499A13] dark:text-[#8ECA3C]">
                A deliberate workflow
              </p>
              <h2 className="mt-3 font-display text-5xl leading-none tracking-wide">FROM SIGNAL TO IMPACT.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#6B7280] dark:text-[#8A9687]">
              A shared rhythm connects teams, evidence, actions, and reporting without adding operational friction.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              ['01', 'Capture', 'Bring ESG activity into one trusted view.'],
              ['02', 'Measure', 'Translate actions into comparable signals.'],
              ['03', 'Mobilize', 'Give teams clear, achievable next steps.'],
              ['04', 'Report', 'Share credible progress with confidence.']
            ].map(([n, t, c]) => (
              <div key={n} className="border-t-2 border-[#8ECA3C] pt-5">
                <p className="font-display text-4xl text-[#499A13] dark:text-[#8ECA3C]">{n}</p>
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280] dark:text-[#8A9687]">{c}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="impact" className="bg-[#244E18] px-5 py-20 text-white md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <BarChart3Icon className="mx-auto text-[#BBDC12]" size={30} />
            <h2 className="mt-5 font-display text-6xl leading-none tracking-wide">MAKE PROGRESS VISIBLE.</h2>
            <p className="mx-auto mt-5 max-w-xl text-[#D5E6C9]">
              Move from annual compliance to an ESG practice your whole business can act on every day.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button className="bg-[#BBDC12] text-[#254016] hover:bg-[#cadb20]">
                Enter EcoSphere <ArrowRightIcon size={16} />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-[#758171] dark:text-[#6B7B67] md:flex-row md:justify-between md:px-8">
        <p>© 2026 EcoSphere. Integrating Sustainability into Everyday Business.</p>
        <div className="flex gap-5">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#impact">Impact</a>
        </div>
      </footer>
    </div>
  );
}