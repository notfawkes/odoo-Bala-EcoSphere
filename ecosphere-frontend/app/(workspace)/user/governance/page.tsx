"use client";

import React from 'react';
import { PlusIcon, ShieldAlertIcon } from 'lucide-react';
import { policies } from '@/lib/mockData';
import {
  Button,
  Card,
  DataTable,
  FilterBar,
  PageHeader
} from '@/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel, canAccess } from '@/lib/permissions';
import { SectionTabs, Kpi, ViewOnlyBanner } from '@/components/common/Shared';

export default function GovernancePage() {
  const { role } = useAuth();
  const policyAccess = getAccessLevel(role, 'policies');
  const auditAccess = canAccess(role, 'audits');

  return (
    <div>
      <PageHeader
        eyebrow="Governance"
        title="TRUST, BY DESIGN."
        description="Maintain policy discipline, clear audit trails, and a live view of compliance risk."
        action={
          policyAccess === 'full' ? (
            <Button>
              <PlusIcon size={16} /> Create policy
            </Button>
          ) : undefined
        }
      />
      
      {policyAccess === 'view' && <ViewOnlyBanner message="You have view-only access to policies." />}
      {policyAccess === 'read_acknowledge' && (
        <div className="mb-5 rounded-xl border border-[#D8E8D0] bg-[#F0F7EB] px-4 py-3 text-sm font-medium text-[#42663a] dark:border-[#2A4222] dark:bg-[#1A2D16] dark:text-[#8ECA3C]">
          📋 You can read and acknowledge policies assigned to you.
        </div>
      )}

      <SectionTabs
        tabs={['Policies', 'Acknowledgements', 'Audits', 'Compliance issues']}
        disabledTabs={!auditAccess ? ['Audits', 'Compliance issues'] : []}
      />
      
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="Policy acknowledgement"
          value="94%"
          detail="32 acknowledgements outstanding"
        />
        {auditAccess && <Kpi label="Open audit items" value="7" detail="2 require attention" />}
        {auditAccess && <Kpi label="Compliance score" value="91" detail="+2 points this quarter" />}
        {!auditAccess && <Kpi label="Your acknowledgements" value="6/7" detail="1 pending" />}
        {!auditAccess && <Kpi label="Policies assigned" value="7" detail="Active policies" />}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Card>
          <div className="p-5">
            <h2 className="font-bold dark:text-[#E8F0E4]">Policy register</h2>
            <FilterBar placeholder="Search policies..." />
          </div>
          <DataTable
            headings={['ID', 'Policy', 'Acknowledged', 'Next action', 'Status']}
            rows={policies}
          />
        </Card>
        <Card className="p-5">
          {auditAccess ? (
            <>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00] dark:bg-[#2D2510] dark:text-[#F0B429]">
                  <ShieldAlertIcon size={19} />
                </span>
                <div>
                  <h2 className="font-bold dark:text-[#E8F0E4]">Compliance watch</h2>
                  <p className="text-xs text-[#758171] dark:text-[#6B7B67]">Items needing attention</p>
                </div>
              </div>
              <div className="mt-6 space-y-5 border-l border-[#D8E8D0] pl-5 dark:border-[#2A4222]">
                {[
                  ['Today', 'Supplier due diligence evidence missing'],
                  ['18 Jun', 'Data Ethics policy acknowledgement closes'],
                  ['25 Jun', 'Q2 internal audit begins']
                ].map(([date, item]) => (
                  <div key={date}>
                    <p className="text-xs font-bold text-[#499A13] dark:text-[#8ECA3C]">{date}</p>
                    <p className="mt-1 text-sm leading-5 text-[#52604E] dark:text-[#8A9687]">{item}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="font-bold dark:text-[#E8F0E4]">Pending acknowledgements</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">Policies requiring your review</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]">
                  <p className="font-semibold dark:text-[#E8F0E4]">Data Ethics & Privacy</p>
                  <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">Due by 25 Jun 2026</p>
                  <Button className="mt-3 w-full h-8 text-xs">Acknowledge</Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
