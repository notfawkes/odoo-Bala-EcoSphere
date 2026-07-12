"use client";

import React, { useState } from 'react';
import {
  UserIcon,
  LockIcon,
  SlidersIcon,
  ShieldAlertIcon,
  CheckIcon,
  Loader2Icon,
  SaveIcon,
  BellIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { Button, Card } from '@/app/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'profile' | 'security' | 'preferences' | 'admin';

export default function SettingsPage() {
  const { user, role } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // Profile settings state
  const [name, setName] = useState(user.name || '');
  const [title, setTitle] = useState(user.title || '');
  const [department, setDepartment] = useState(user.department || '');
  
  // Password settings state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [reportFrequency, setReportFrequency] = useState('monthly');

  // Admin settings state
  const [targetScore, setTargetScore] = useState(85);
  const [emissionCap, setEmissionCap] = useState(1200);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const triggerToast = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setErrorMessage(null);
    } else {
      setErrorMessage(message);
      setSuccessMessage(null);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 4000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const token = localStorage.getItem('ecosphere_jwt') || sessionStorage.getItem('ecosphere_jwt');
    if (!token || token.startsWith('mock-jwt-')) {
      const emailClean = user.email.toLowerCase().trim();
      const localUsers = JSON.parse(localStorage.getItem('ecosphere_local_users') || '{}');
      if (localUsers[emailClean]) {
        localUsers[emailClean].name = name;
        localUsers[emailClean].title = title;
        localUsers[emailClean].department = department;
        localUsers[emailClean].initials = name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase();
        localStorage.setItem('ecosphere_local_users', JSON.stringify(localUsers));
        triggerToast('success', 'Profile updated locally! Please refresh the page to apply headers.');
      } else {
        triggerToast('error', 'User not found in local storage fallback.');
      }
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, title, department })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to update profile settings.');
      }

      const updatedUser = await res.json();
      triggerToast('success', 'Profile settings updated successfully! Please reload to refresh the workspace header.');
    } catch (err: any) {
      triggerToast('error', err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast('error', 'New passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    const token = localStorage.getItem('ecosphere_jwt') || sessionStorage.getItem('ecosphere_jwt');
    if (!token || token.startsWith('mock-jwt-')) {
      const emailClean = user.email.toLowerCase().trim();
      const localUsers = JSON.parse(localStorage.getItem('ecosphere_local_users') || '{}');
      if (localUsers[emailClean]) {
        if (localUsers[emailClean].password !== oldPassword) {
          triggerToast('error', 'Invalid current password (Local Fallback).');
        } else {
          localUsers[emailClean].password = newPassword;
          localStorage.setItem('ecosphere_local_users', JSON.stringify(localUsers));
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          triggerToast('success', 'Password updated locally!');
        }
      }
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to change password.');
      }

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('success', 'Password changed successfully!');
    } catch (err: any) {
      triggerToast('error', err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Toast Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#EAF5E4] border border-[#BCE2A7] px-4 py-3 text-sm font-semibold text-[#255015] shadow-lg dark:bg-[#1E3319] dark:border-[#355A2B] dark:text-[#C8E6B8]"
          >
            <CheckIcon size={16} />
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#FEF3F2] border border-[#FDA29B] px-4 py-3 text-sm font-semibold text-[#B42318] shadow-lg dark:bg-[#2C1614] dark:border-[#912018]/50 dark:text-[#F04438]"
          >
            <span className="text-base">⚠️</span>
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#499A13] dark:text-[#8ECA3C]">
          System Config
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-wide text-[#1B1B1B] dark:text-[#E8F0E4]">
          WORKSPACE SETTINGS
        </h1>
        <p className="mt-2 text-sm text-[#6B7280] dark:text-[#8A9687]">
          Manage your account profile, preferences, credentials, and environmental thresholds.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[250px_1fr]">
        {/* Navigation Sidebar (Scroll row on mobile, column on desktop) */}
        <aside className="flex flex-row overflow-x-auto gap-2 pb-2 scrollbar-none lg:flex-col lg:overflow-visible lg:pb-0 border-b border-[#EDF2E9] lg:border-b-0 dark:border-[#1E3319]">
          {[
            { id: 'profile', label: 'Account Profile', icon: UserIcon },
            { id: 'security', label: 'Security & Auth', icon: LockIcon },
            { id: 'preferences', label: 'Preferences', icon: SlidersIcon },
            ...(role === 'admin' ? [{ id: 'admin', label: 'ESG Configurations', icon: ShieldAlertIcon }] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full lg:py-3 ${
                  isSelected
                    ? 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]'
                    : 'text-[#667462] hover:bg-white dark:text-[#8A9687] dark:hover:bg-[#1A2D16]'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main>
          <Card className="p-5 sm:p-6 md:p-8 bg-white dark:bg-[#162212]/50 backdrop-blur">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-[#3E4D3A] dark:text-[#C8E6B8] mb-6 border-b border-[#EDF2E9] pb-3 dark:border-[#1E3319]">
                    Account Profile Settings
                  </h3>
                  <form onSubmit={handleProfileSave} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                        Full Name
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:focus:border-[#4DA616]"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                        Work Email Address
                        <input
                          type="email"
                          disabled
                          value={user.email}
                          className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5]/50 bg-gray-50 px-4 text-sm text-gray-400 outline-none dark:border-[#2A4222]/50 dark:bg-[#162212]/50 dark:text-gray-600"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                        Job Designation
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:focus:border-[#4DA616]"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                        Organization Department
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:focus:border-[#4DA616]"
                        />
                      </label>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center gap-2">
                        {isLoading ? <Loader2Icon size={16} className="animate-spin" /> : <SaveIcon size={16} />}
                        Save Account Changes
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-[#3E4D3A] dark:text-[#C8E6B8] mb-6 border-b border-[#EDF2E9] pb-3 dark:border-[#1E3319]">
                    Security Credentials Settings
                  </h3>
                  <form onSubmit={handlePasswordSave} className="space-y-5">
                    <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8] max-w-md">
                      Current Password
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:focus:border-[#4DA616]"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8] max-w-md">
                      New Security Password
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:focus:border-[#4DA616]"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8] max-w-md">
                      Confirm New Password
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] dark:focus:border-[#4DA616]"
                      />
                    </label>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center gap-2">
                        {isLoading ? <Loader2Icon size={16} className="animate-spin" /> : <SaveIcon size={16} />}
                        Update Security Password
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#3E4D3A] dark:text-[#C8E6B8] mb-6 border-b border-[#EDF2E9] pb-3 dark:border-[#1E3319]">
                      Platform Preference Toggles
                    </h3>
                    
                    {/* Theme Mode Toggle */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4 border-b border-[#F0F4EF] dark:border-[#1A2617]">
                      <div>
                        <p className="font-semibold text-sm text-[#3E4D3A] dark:text-[#C8E6B8]">Workspace Interface Theme</p>
                        <p className="text-xs text-[#7A8577] dark:text-[#6B7B67]">Switch between the light forest and dark woodland interface.</p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE8D5] px-4 py-2 text-sm font-semibold hover:bg-[#F5F8F2] dark:border-[#2A4222] dark:hover:bg-[#1C2C18] dark:text-[#E8F0E4]"
                      >
                        {darkMode ? <SunIcon size={16} className="text-[#8ECA3C]" /> : <MoonIcon size={16} className="text-[#499A13]" />}
                        {darkMode ? 'Light Theme' : 'Dark Theme'}
                      </button>
                    </div>

                    {/* Email Notifications Toggle */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4 border-b border-[#F0F4EF] dark:border-[#1A2617]">
                      <div>
                        <p className="font-semibold text-sm text-[#3E4D3A] dark:text-[#C8E6B8]">Email Reporting Alerts</p>
                        <p className="text-xs text-[#7A8577] dark:text-[#6B7B67]">Receive alerts on ESG performance scores and goals via email.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="h-5 w-5 rounded border-[#DCE8D5] accent-[#499A13] cursor-pointer self-start sm:self-auto"
                      />
                    </div>

                    {/* Push Notifications Toggle */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4 border-b border-[#F0F4EF] dark:border-[#1A2617]">
                      <div>
                        <p className="font-semibold text-sm text-[#3E4D3A] dark:text-[#C8E6B8]">Real-time Push Notifications</p>
                        <p className="text-xs text-[#7A8577] dark:text-[#6B7B67]">Get instant notifications on pending audits and CSR actions.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="h-5 w-5 rounded border-[#DCE8D5] accent-[#499A13] cursor-pointer self-start sm:self-auto"
                      />
                    </div>

                    {/* Reporting Frequency */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4">
                      <div>
                        <p className="font-semibold text-sm text-[#3E4D3A] dark:text-[#C8E6B8]">Performance Report Frequency</p>
                        <p className="text-xs text-[#7A8577] dark:text-[#6B7B67]">Choose how often summarized ESG metrics should be prepared.</p>
                      </div>
                      <select
                        value={reportFrequency}
                        onChange={(e) => setReportFrequency(e.target.value)}
                        className="h-10 rounded-xl border border-[#DCE8D5] bg-white px-3 text-sm outline-none dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4] w-full sm:w-auto"
                      >
                        <option value="weekly">Weekly Summary</option>
                        <option value="monthly">Monthly Full Report</option>
                        <option value="quarterly">Quarterly Audits</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'admin' && role === 'admin' && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-[#3E4D3A] dark:text-[#C8E6B8] mb-6 border-b border-[#EDF2E9] pb-3 dark:border-[#1E3319]">
                    Corporate ESG Target Configurations
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                      Global Target Score (Overall ESG)
                      <input
                        type="number"
                        value={targetScore}
                        onChange={(e) => setTargetScore(parseInt(e.target.value) || 0)}
                        className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4]"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-[#3E4D3A] dark:text-[#C8E6B8]">
                      Monthly Carbon Emissions Threshold (tCO2e)
                      <input
                        type="number"
                        value={emissionCap}
                        onChange={(e) => setEmissionCap(parseInt(e.target.value) || 0)}
                        className="mt-2 h-12 w-full rounded-xl border border-[#DCE8D5] bg-white px-4 text-sm outline-none transition focus:border-[#499A13] focus:ring-2 focus:ring-[#D8ECCB] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#E8F0E4]"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => triggerToast('success', 'Corporate ESG targets saved successfully!')} className="w-full sm:w-auto flex items-center justify-center gap-2">
                      <SaveIcon size={16} />
                      Save ESG Thresholds
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </main>
      </div>
    </div>
  );
}
