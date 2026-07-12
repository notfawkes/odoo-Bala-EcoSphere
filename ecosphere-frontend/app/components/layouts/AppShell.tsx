"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  GaugeIcon,
  GiftIcon,
  LeafIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SunIcon,
  UsersIcon,
  XIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { notifications } from '@/lib/mockData';
import { StatusChip } from '../ui/Primitives';
import { useAuth, roleLabels } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { canAccessPath } from '@/lib/permissions';

const navigation = [
  ['/dashboard', 'Dashboard', GaugeIcon],
  ['/environmental', 'Environmental', LeafIcon],
  ['/social', 'Social', UsersIcon],
  ['/governance', 'Governance', ShieldCheckIcon],
  ['/gamification', 'Gamification', GiftIcon],
  ['/reports', 'Reports', FileTextIcon]
] as const;

const secondary = [
  ['/settings', 'Settings', SettingsIcon],
  ['/profile', 'Profile', LogOutIcon]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  // Filter navigation items based on role
  const filteredNav = navigation.filter(([path]) => canAccessPath(role, path as string));
  const filteredSecondary = secondary.filter(([path]) => canAccessPath(role, path as string));
  const allNavItems = [...filteredNav, ...filteredSecondary];

  const roleBadgeColor =
    role === 'admin'
      ? 'bg-[#499A13] text-white dark:bg-[#4DA616]'
      : 'bg-[#F0F3EE] text-[#556052] dark:bg-[#1A2218] dark:text-[#8A9687]';

  const Sidebar = (
    <motion.aside
      animate={{
        width: collapsed ? 88 : 248
      }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 32
      }}
      className="hidden min-h-screen shrink-0 flex-col border-r border-[#E6EFE0] bg-white p-3 dark:border-[#1E3319] dark:bg-[#111E0E] md:flex"
    >
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-3 px-3 pt-2"
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#499A13] text-white">
          <LeafIcon size={19} />
        </div>
        {!collapsed && (
          <span className="font-display text-3xl tracking-wide text-[#24421c] dark:text-[#C8E6B8]">
            ECOSPHERE
          </span>
        )}
      </Link>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary navigation">
        {filteredNav.map(([to, label, Icon]) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to as string}
              href={to as string}
              title={collapsed ? label as string : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]'
                  : 'text-[#667462] hover:bg-[#F5F8F2] hover:text-[#35592D] dark:text-[#8A9687] dark:hover:bg-[#1A2D16] dark:hover:text-[#C8E6B8]'
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#EDF2E9] pt-3 dark:border-[#1E3319]">
        {filteredSecondary.map(([to, label, Icon]) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to as string}
              href={to as string}
              title={collapsed ? label as string : undefined}
              className={`mb-1 flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${
                isActive
                  ? 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]'
                  : 'text-[#667462] hover:bg-[#F5F8F2] dark:text-[#8A9687] dark:hover:bg-[#1A2D16]'
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="mb-1 flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#667462] hover:bg-[#F5F8F2] dark:text-[#8A9687] dark:hover:bg-[#1A2D16]"
          title={collapsed ? (darkMode ? 'Light mode' : 'Dark mode') : undefined}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          {!collapsed && <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        {/* Logout button */}
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="mb-1 flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#667462] hover:bg-[#F5F8F2] dark:text-[#8A9687] dark:hover:bg-[#1A2D16]"
          title={collapsed ? 'Sign out' : undefined}
          aria-label="Sign out"
        >
          <LogOutIcon size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 flex h-10 w-full items-center justify-center rounded-xl text-[#71816D] hover:bg-[#F5F8F2] dark:text-[#6B7B67] dark:hover:bg-[#1A2D16]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>
    </motion.aside>
  );

  return (
    <div className="flex min-h-screen bg-[#F7FAF5] dark:bg-[#0F1A0D]">
      {Sidebar}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[#E6EFE0] bg-[#F7FAF5]/95 px-4 backdrop-blur dark:border-[#1E3319] dark:bg-[#0F1A0D]/95 md:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl text-[#42663a] hover:bg-white dark:text-[#8ECA3C] dark:hover:bg-[#1A2D16] md:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon size={20} />
            </button>
            <div className="hidden w-[min(34vw,360px)] items-center gap-2 rounded-xl border border-[#E6EFE0] bg-white px-3 py-2.5 dark:border-[#1E3319] dark:bg-[#162212] md:flex">
              <SearchIcon size={17} className="text-[#7A8577] dark:text-[#6B7B67]" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#98A396] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56]"
                placeholder="Search EcoSphere"
                aria-label="Search EcoSphere"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle for mobile */}
            <button
              onClick={toggleDarkMode}
              className="grid h-10 w-10 place-items-center rounded-xl text-[#496046] hover:bg-white dark:text-[#8A9687] dark:hover:bg-[#1A2D16] md:hidden"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <SunIcon size={19} /> : <MoonIcon size={19} />}
            </button>
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-xl text-[#496046] hover:bg-white dark:text-[#8A9687] dark:hover:bg-[#1A2D16]"
              aria-label="Open notifications"
            >
              <BellIcon size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#DC2626] ring-2 ring-[#F7FAF5] dark:ring-[#0F1A0D]" />
            </button>
            <div className="ml-1 hidden text-right sm:block">
              <p className="text-xs font-bold text-[#354333] dark:text-[#C8E6B8]">{user.name}</p>
              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${roleBadgeColor}`}>
                {roleLabels[role]}
              </span>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#D8ECCB] text-xs font-bold text-[#356F14] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
              {user.initials}
            </div>
          </div>
        </header>
        <main className="px-4 py-7 md:px-7 lg:px-9">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#183314]/25 dark:bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white p-4 shadow-2xl dark:bg-[#111E0E] md:hidden"
            >
              <div className="mb-7 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-3xl text-[#24421c] dark:text-[#C8E6B8]"
                >
                  <LeafIcon />
                  ECOSPHERE
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="dark:text-[#8A9687]"
                  aria-label="Close navigation"
                >
                  <XIcon />
                </button>
              </div>
              <nav className="space-y-1">
                {allNavItems.map(([to, label, Icon]) => {
                  const isActive = pathname === to;
                  return (
                    <Link
                      onClick={() => setMobileOpen(false)}
                      key={to as string}
                      href={to as string}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                        isActive
                          ? 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]'
                          : 'text-[#667462] dark:text-[#8A9687]'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  );
                })}

                {/* Mobile dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#667462] dark:text-[#8A9687]"
                >
                  {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </button>

                {/* Mobile logout */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                    router.push('/login');
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#667462] dark:text-[#8A9687]"
                >
                  <LogOutIcon size={18} />
                  Sign out
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notificationsOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#183314]/15 dark:bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotificationsOpen(false)}
            />
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 30, stiffness: 330 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[390px] border-l border-[#E6EFE0] bg-white p-6 shadow-2xl dark:border-[#1E3319] dark:bg-[#111E0E]"
              aria-label="Notifications"
            >
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#499A13] dark:text-[#8ECA3C]">
                    Inbox
                  </p>
                  <h2 className="font-display text-4xl text-[#1B1B1B] dark:text-[#E8F0E4]">
                    NOTIFICATIONS
                  </h2>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="rounded-lg p-2 hover:bg-[#F5F8F2] dark:text-[#8A9687] dark:hover:bg-[#1A2D16]"
                  aria-label="Close notifications"
                >
                  <XIcon />
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <article
                    key={n.title}
                    className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-[#344431] dark:text-[#C8E6B8]">
                        {n.title}
                      </p>
                      {n.unread && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#499A13]" />
                      )}
                    </div>
                    <p className="text-sm leading-5 text-[#6B7280] dark:text-[#8A9687]">
                      {n.description}
                    </p>
                    <div className="mt-3 flex justify-between">
                      <StatusChip status={n.category} />
                      <span className="text-xs text-[#83907F] dark:text-[#6B7B67]">{n.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}