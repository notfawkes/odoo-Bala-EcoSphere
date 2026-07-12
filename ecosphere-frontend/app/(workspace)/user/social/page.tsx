"use client";

import React from 'react';
import { PlusIcon, UsersIcon } from 'lucide-react';
import { departments } from '@/lib/mockData';
import {
  Button,
  Card,
  PageHeader,
  ProgressBar,
  StatusChip
} from '@/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel, canAccess } from '@/lib/permissions';
import { SectionTabs, Kpi } from '@/components/common/Shared';

export default function SocialPage() {
  const { role } = useAuth();
  const csrAccess = getAccessLevel(role, 'csr_activities');
  const approveAccess = canAccess(role, 'approve_csr');

  return (
    <div>
      <PageHeader
        eyebrow="Social"
        title="PEOPLE & PURPOSE."
        description="See how employee participation and community work translate into measurable social value."
        action={
          csrAccess === 'full' ? (
            <Button>
              <PlusIcon size={16} /> Log CSR activity
            </Button>
          ) : csrAccess === 'join' ? (
            <Button variant="secondary">
              <UsersIcon size={16} /> Browse activities
            </Button>
          ) : undefined
        }
      />
      
      <SectionTabs
        tabs={['CSR activities', 'Participation', 'Diversity', 'Training']}
        disabledTabs={!approveAccess ? ['Participation'] : []}
      />
      
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="Participation rate"
          value="76%"
          detail="+9% since last quarter"
        />
        <Kpi
          label="Volunteer hours"
          value="1,284"
          detail="Across 18 programs"
        />
        <Kpi label="Training completion" value="93%" detail="Target: 90%" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold dark:text-[#E8F0E4]">CSR activities</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                Community impact this quarter
              </p>
            </div>
            {approveAccess && <StatusChip status="3 pending" />}
          </div>
          <div className="mt-5 space-y-3">
            {[
              ['Food bank volunteer day', '124 hours • 36 participants', 'Pending approval'],
              ['STEM mentorship program', '286 hours • 18 participants', 'Complete'],
              ['Park restoration morning', '96 hours • 42 participants', 'On track']
            ].map(([title, detail, status]) => (
              <div
                className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]"
                key={title}
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold dark:text-[#E8F0E4]">{title}</p>
                    <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">{detail}</p>
                  </div>
                  <StatusChip status={status} />
                </div>
                {csrAccess === 'join' && status !== 'Complete' && (
                  <Button variant="secondary" className="mt-3 w-full text-xs h-8">
                    Join activity
                  </Button>
                )}
                {approveAccess && status === 'Pending approval' && (
                  <div className="mt-3 flex gap-2">
                    <Button className="flex-1 text-xs h-8">Approve</Button>
                    <Button variant="secondary" className="flex-1 text-xs h-8">Review</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold dark:text-[#E8F0E4]">Engagement by department</h2>
          <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
            Participation in active programs
          </p>
          <div className="mt-6 space-y-5">
            {departments.map((d) => (
              <div key={d.name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium dark:text-[#E8F0E4]">{d.name}</span>
                  <span className="font-bold text-[#397B14] dark:text-[#8ECA3C]">
                    {Math.min(96, d.score)}%
                  </span>
                </div>
                <ProgressBar value={Math.min(96, d.score)} color="#8ECA3C" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
