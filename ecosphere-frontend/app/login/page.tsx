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
  Loader2Icon,
  BriefcaseIcon,
  BuildingIcon,
  MailIcon,
  LockIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Primitives';
import { useAuth, Role, SignupData } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const roleOptions: { value: Role; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'admin', label: 'Admin', icon: ShieldIcon, description: 'Full access to all features' },
  { value: 'employee', label: 'Employee', icon: UserIcon, description: 'Personal dashboard & tasks' },
];

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, signup, isLoggedIn, isInitialized, role } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && isLoggedIn) {
      router.replace(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [isInitialized, isLoggedIn, role, router]);

  const currentRoleOption = roleOptions.find(r => r.value === selectedRole)!;

  if (!isInitialized || (isInitialized && isLoggedIn)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAF5] dark:bg-[#0F1A0D]">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon className="h-10 w-10 animate-spin text-[#499A13] dark:text-[#8ECA3C]" />
          <p className="text-sm font-semibold text-[#566352] dark:text-[#8A9687]">Initializing secure workspace...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError('Please enter your full name.');
        setIsLoading(false);
        return;
      }
      if (selectedRole === 'employee' && (!title || !department)) {
        setError('Job title and department are required for employees.');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const signupData: SignupData = {
          email,
          password,
          name,
          title,
          department,
          role: selectedRole
        };
        const resolvedRole = await signup(signupData, rememberMe);
        router.push(resolvedRole === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        const resolvedRole = await login(email, password, rememberMe);
        router.push(resolvedRole === 'admin' ? '/admin/dashboard' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white dark:bg-[#0F1A0D] lg:grid-cols-2">
      {/* Left side banner */}
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

      {/* Right side form */}
      <section className="flex items-center justify-center bg-[#F7FAF5] px-5 py-10 dark:bg-[#0F1A0D]">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-3xl tracking-wide text-[#24421c] dark:text-[#C8E6B8] lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#499A13] text-white">
              <LeafIcon size={16} />
            </span>
            ECOSPHERE
          </Link>
          
          <p className="mt-10 text-xs font-bold uppercase tracking-[.18em] text-[#499A13] dark:text-[#8ECA3C]">
            {isSignUp ? 'Get started' : 'Welcome back'}
          </p>
          <h2 className="mt-2 font-display text-5xl tracking-wide text-[#1B1B1B] dark:text-[#E8F0E4]">
            {isSignUp ? 'SIGN UP' : 'SIGN IN'}
          </h2>
          <p className="mt-2 text-sm text-[#6B7280] dark:text-[#8A9687]">
            {isSignUp 
              ? 'Create a new account to join EcoSphere.' 
              : 'Use your organization account to continue.'}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex items-start gap-3 rounded-xl border border-[#FDA29B] bg-[#FEF3F2] p-4 text-sm text-[#B42318] dark:border-[#912018]/50 dark:bg-[#2C1614] dark:text-[#F04438]"
              >
                <span className="text-base select-none">⚠️</span>
                <p className="font-semibold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Name field (Only shown for Sign Up) */}
            <AnimatePresence initial={false}>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                    Full Name
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#7A8577] dark:text-[#6B7B67]">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        required={isSignUp}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="h-12 w-full rounded-xl border border-[#DCE8D5] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]"
                      />
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Work email
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#7A8577] dark:text-[#6B7B67]">
                  <MailIcon size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-12 w-full rounded-xl border border-[#DCE8D5] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]"
                />
              </div>
            </label>

            <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
              Password
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#7A8577] dark:text-[#6B7B67]">
                  <LockIcon size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-[#DCE8D5] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]"
                />
              </div>
            </label>

            {/* Role selector */}
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                {isSignUp ? 'Register as' : 'Sign in as'}
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

              {/* Dropdown options */}
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

            {/* Dynamic Job Title & Department fields (Only for Employee in Sign Up) */}
            <AnimatePresence initial={false}>
              {isSignUp && selectedRole === 'employee' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                    Job Title
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#7A8577] dark:text-[#6B7B67]">
                        <BriefcaseIcon size={16} />
                      </span>
                      <input
                        type="text"
                        required={isSignUp && selectedRole === 'employee'}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Manager"
                        className="h-12 w-full rounded-xl border border-[#DCE8D5] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                    Department
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#7A8577] dark:text-[#6B7B67]">
                        <BuildingIcon size={16} />
                      </span>
                      <input
                        type="text"
                        required={isSignUp && selectedRole === 'employee'}
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Operations"
                        className="h-12 w-full rounded-xl border border-[#DCE8D5] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:placeholder:text-[#5A6B56] dark:focus:border-[#4DA616] dark:focus:ring-[#1E3319]"
                      />
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#647060] dark:text-[#8A9687] cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#DCE8D5] accent-[#499A13] cursor-pointer" 
                />
                Remember me
              </label>
              {!isSignUp && (
                <button type="button" className="font-semibold text-[#397B14] dark:text-[#8ECA3C] hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 h-12">
              {isLoading ? (
                <>
                  <Loader2Icon size={16} className="animate-spin" />
                  Processing...
                </>
              ) : isSignUp ? (
                <>
                  Sign Up <ArrowRightIcon size={16} />
                </>
              ) : (
                <>
                  Sign in as {currentRoleOption.label} <ArrowRightIcon size={16} />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm border-t border-[#E6EFE0] pt-6 dark:border-[#1E3319]">
            {isSignUp ? (
              <p className="text-[#6B7280] dark:text-[#8A9687]">
                Already have an organization account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setError(null); }}
                  className="font-bold text-[#397B14] dark:text-[#8ECA3C] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-[#6B7280] dark:text-[#8A9687]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setError(null); }}
                  className="font-bold text-[#397B14] dark:text-[#8ECA3C] hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#7A8577] dark:text-[#6B7B67]">
            <LockKeyholeIcon size={13} /> Secure enterprise workspace
          </div>
        </div>
      </section>
    </main>
  );
}
