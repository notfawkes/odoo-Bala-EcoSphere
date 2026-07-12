"use client";

import React from 'react';
import { AwardIcon, SparklesIcon } from 'lucide-react';
import { Button, Card, PageHeader } from '@/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title={`${user.name.toUpperCase()}.`}
        description="Your personal impact profile and sustainability activity."
        action={<Button variant="secondary">Edit profile</Button>}
      />
      
      <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
        <Card className="p-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#D8ECCB] font-display text-4xl text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
            {user.initials}
          </div>
          <h2 className="mt-5 text-xl font-bold dark:text-[#E8F0E4]">{user.name}</h2>
          <p className="mt-1 text-sm text-[#6B7280] dark:text-[#8A9687]">
            {user.title} • {user.department}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F2F8EF] p-3 dark:bg-[#1A2D16]">
              <p className="font-display text-4xl text-[#315b23] dark:text-[#8ECA3C]">3,420</p>
              <p className="text-xs text-[#758171] dark:text-[#6B7B67]">Reward points</p>
            </div>
            <div className="rounded-xl bg-[#F2F8EF] p-3 dark:bg-[#1A2D16]">
              <p className="font-display text-4xl text-[#315b23] dark:text-[#8ECA3C]">86</p>
              <p className="text-xs text-[#758171] dark:text-[#6B7B67]">Personal ESG score</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold dark:text-[#E8F0E4]">Achievements</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Recognition earned through action
              </p>
            </div>
            <SparklesIcon className="text-[#8ECA3C]" />
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
          <h2 className="mt-8 font-bold dark:text-[#E8F0E4]">Activity timeline</h2>
          <div className="mt-4 space-y-4 border-l border-[#D8E8D0] pl-5 dark:border-[#2A4222]">
            {[
              'Completed Low carbon commute challenge',
              'Logged 6 hours at food bank volunteer day',
              'Reviewed Q2 carbon inventory'
            ].map((item, i) => (
              <div key={item}>
                <p className="text-sm font-medium dark:text-[#E8F0E4]">{item}</p>
                <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                  {i + 1} day{i ? 's' : ''} ago
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}