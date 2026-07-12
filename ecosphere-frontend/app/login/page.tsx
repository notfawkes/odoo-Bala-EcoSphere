"use client";

import React, { useState } from 'react';
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  LeafIcon,
  LockKeyholeIcon,
  ShieldIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Primitives';
import { useAuth, Role } from '@/context/AuthContext';

const roleOptions: { value: Role; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'admin', label: 'Admin', icon: ShieldIcon, description: 'Full access to all features' },
  { value: 'employee', label: 'Employee', icon: UserIcon, description: 'Personal dashboard & tasks' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const currentRoleOption = roleOptions.find(r => r.value === selectedRole)!;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    router.push(selectedRole === 'admin' ? '/admin/dashboard' : '/dashboard');
  };

  return (
    <main className="grid min-h-screen bg-white dark:bg-[#0F1A0D] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#244E18] p-12 text-white lg:flex lg:flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-3xl tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#8ECA3C]">
            <LeafIcon size={19} />
          </span>
          ECOSPHERE
        </Link>
        <div className="my-auto max-w-md">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#BBDC12]">
            Your work, amplified
          </p>
          <h1 className="mt-5 font-display text-7xl leading-[.85] tracking-wide">
            EVERYDAY ACTION. ENDURING IMPACT.
          </h1>
          <p className="mt-6 leading-7 text-[#D5E6C9]">
            One elegant workspace for teams making sustainability measurable,
            trusted, and shared.
          </p>
          <div className="mt-10 space-y-4">
            {[
              'Bring ESG operations into focus',
              'Make participation meaningful',
              'Stay ready for every report'
            ].map((item) => (
              <div className="flex items-center gap-3 text-sm" key={item}>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#5DA726]">
                  <CheckIcon size={14} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#BBD5AE]">
          Integrating Sustainability into Everyday Business
        </p>
      </section>
      <section className="flex items-center justify-center bg-[#F7FAF5] px-5 py-10 dark:bg-[#0F1A0D]">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-3xl tracking-wide text-[#24421c] dark:text-[#C8E6B8] lg:hidden">
            <LeafIcon />
            ECOSPHERE
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[.18em] text-[#499A13] dark:text-[#8ECA3C]">
            Welcome back
          </p>
          <h2 className="mt-2 font-display text-5xl tracking-wide text-[#1B1B1B] dark:text-[#E8F0E4]">
            SIGN IN
          </h2>
          <p className="mt-2 text-sm text-[#6B7280] dark:text-[#8A9687]">
            Use your organization account to continue.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Work email
              <input
                type="email"
                placeholder="you@company.com"
                className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]" />
            </label>
            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Password
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]" />
            </label>

            {/* Role selector */}
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                Sign in as
              </label>
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm transition hover:border-[#499A13] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:hover:border-[#4DA616]">
                <div className="flex items-center gap-3">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${selectedRole === 'admin' ? 'bg-[#499A13] text-white' : 'bg-[#F0F3EE] text-[#556052] dark:bg-[#1A2218] dark:text-[#8A9687]'}`}>
                    <currentRoleOption.icon size={15} />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">{currentRoleOption.label}</p>
                  </div>
                </div>
                <ChevronDownIcon size={16} className={`text-[#7A8577] transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-[#E6EFE0] bg-white shadow-xl dark:border-[#1E3319] dark:bg-[#162212]">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSelectedRole(opt.value); setRoleDropdownOpen(false); }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#F5F8F2] dark:hover:bg-[#1A2D16] ${selectedRole === opt.value ? 'bg-[#EAF5E4] dark:bg-[#1E3319]' : ''}`}>
                      <span className={`grid h-7 w-7 place-items-center rounded-lg ${opt.value === 'admin' ? 'bg-[#499A13] text-white' : 'bg-[#F0F3EE] text-[#556052] dark:bg-[#1A2218] dark:text-[#8A9687]'}`}>
                        <opt.icon size={15} />
                      </span>
                      <div>
                        <p className="font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">{opt.label}</p>
                        <p className="text-xs text-[#7A8577] dark:text-[#6B7B67]">{opt.description}</p>
                      </div>
                      {selectedRole === opt.value && (
                        <CheckIcon size={16} className="ml-auto text-[#499A13] dark:text-[#8ECA3C]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#647060] dark:text-[#8A9687]">
                <input type="checkbox" className="h-4 w-4 accent-[#499A13]" />
                Remember me
              </label>
              <button type="button" className="font-semibold text-[#397B14] dark:text-[#8ECA3C]">
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full">
              Sign in as {currentRoleOption.label} <ArrowRightIcon size={16} />
            </Button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#7A8577] dark:text-[#6B7B67]">
            <LockKeyholeIcon size={13} /> Secure enterprise workspace
          </div>
        </div>
      </section>
    </main>
  );
}
