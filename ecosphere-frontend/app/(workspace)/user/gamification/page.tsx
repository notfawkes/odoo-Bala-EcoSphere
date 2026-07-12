"use client";

import React from 'react';
import { AwardIcon, GiftIcon, TrophyIcon } from 'lucide-react';
import { challenges } from '@/lib/mockData';
import {
  Button,
  Card,
  PageHeader,
  ProgressBar
} from '@/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel } from '@/lib/permissions';
import { SectionTabs, Kpi, ViewOnlyBanner } from '@/components/common/Shared';

export default function GamificationPage() {
  const { role } = useAuth();
  const challengeAccess = getAccessLevel(role, 'challenges');
  const badgeAccess = getAccessLevel(role, 'badges');
  const rewardAccess = getAccessLevel(role, 'rewards');

  const actionLabel = challengeAccess === 'join' ? 'Join challenge' :
                      challengeAccess === 'full' ? 'View challenge' : 'View challenge';

  return (
    <div>
      <PageHeader
        eyebrow="Gamification"
        title="MAKE ACTION CONTAGIOUS."
        description="Turn sustainable habits into shared momentum with visible recognition and rewards."
        action={
          rewardAccess === 'manage' ? (
            <Button>
              <GiftIcon size={16} /> Manage rewards
            </Button>
          ) : rewardAccess === 'redeem' ? (
            <Button>
              <GiftIcon size={16} /> Reward store
            </Button>
          ) : (
            <Button variant="secondary">
              <GiftIcon size={16} /> View rewards
            </Button>
          )
        }
      />
      
      {badgeAccess === 'view' && rewardAccess === 'view' && (
        <ViewOnlyBanner message="You have view-only access to badges and rewards." />
      )}

      <SectionTabs tabs={['Challenges', 'Badges', 'Rewards', 'Leaderboard']} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="Active challenges"
          value="12"
          detail="305 employees participating"
        />
        <Kpi label="Points awarded" value="28.4K" detail="+18% this month" />
        <Kpi
          label="Completion rate"
          value="74%"
          detail="Across active challenges"
        />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {challenges.map((c) => (
          <Card className="p-5" key={c.title}>
            <div className="flex items-start justify-between">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl text-white"
                style={{ background: c.color }}
              >
                <TrophyIcon size={18} />
              </span>
              <span className="rounded-full bg-[#F3F8EF] px-2 py-1 text-xs font-bold text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]">
                +{c.xp} XP
              </span>
            </div>
            <h2 className="mt-5 font-bold dark:text-[#E8F0E4]">{c.title}</h2>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-[#8A9687]">{c.description}</p>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-[#758171] dark:text-[#6B7B67]">
                <span>{c.participants} participants</span>
                <span>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} color={c.color} />
            </div>
            <Button variant="secondary" className="mt-5 w-full">
              {actionLabel}
            </Button>
          </Card>
        ))}
      </div>
      <Card className="mt-5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold dark:text-[#E8F0E4]">Impact leaderboard</h2>
            <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
              Current monthly standings
            </p>
          </div>
          <AwardIcon className="text-[#8ECA3C]" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ['1', 'Maya Chen', '3,420'],
            ['2', 'Ari Gomez', '3,180'],
            ['3', 'Jordan Lee', '2,970']
          ].map(([rank, name, xp]) => (
            <div
              className="flex items-center gap-3 rounded-xl bg-[#F6F9F4] p-3 dark:bg-[#1A2D16]"
              key={rank}
            >
              <span className="font-display text-3xl text-[#499A13] dark:text-[#8ECA3C]">
                {rank}
              </span>
              <div>
                <p className="text-sm font-bold dark:text-[#E8F0E4]">{name}</p>
                <p className="text-xs text-[#758171] dark:text-[#6B7B67]">{xp} XP</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
