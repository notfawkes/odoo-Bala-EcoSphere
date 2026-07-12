"use client";

import React from 'react';
import { PlusIcon } from 'lucide-react';
import { transactions } from '@/lib/mockData';
import {
  Button,
  Card,
  DataTable,
  FilterBar,
  PageHeader,
  ProgressBar
} from '@/app/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel } from '@/config/permissions';
import { SectionTabs, Kpi, ViewOnlyBanner } from '@/app/components/common/Shared';

export default function EnvironmentalPage() {
  const { role } = useAuth();
  const emissionAccess = getAccessLevel(role, 'emission_factors');
  const goalAccess = getAccessLevel(role, 'environmental_goals');

  return (
    <div>
      <PageHeader
        eyebrow="Environmental"
        title="FOOTPRINT CONTROL."
        description="Measure, manage, and reduce operational impact with one defensible environmental record."
        action={
          role === 'admin' ? (
            <Button>
              <PlusIcon size={16} /> Add transaction
            </Button>
          ) : undefined
        }
      />
      
      {emissionAccess === 'view' && <ViewOnlyBanner message="You have view-only access to emission factors." />}

      <SectionTabs
        tabs={['Overview', 'Emission factors', 'Product ESG profiles', 'Carbon transactions', 'Goals']}
        disabledTabs={emissionAccess === 'view' ? [] : emissionAccess === 'none' ? ['Emission factors', 'Carbon transactions'] : []}
      />
      
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="YTD emissions" value="2,418" detail="tCO₂e • −12.6% YoY" />
        <Kpi label="Reduction target" value="68%" detail="On track for FY26" />
        <Kpi label="Data coverage" value="94%" detail="Up 8 points this quarter" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Card>
          <div className="p-5">
            <h2 className="font-bold dark:text-[#E8F0E4]">Carbon transactions</h2>
            <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
              Latest reported activity
            </p>
            <FilterBar placeholder="Search transactions..." />
          </div>
          <DataTable
            headings={['Reference', 'Department', 'Activity', 'Impact', 'Status']}
            rows={transactions}
          />
        </Card>
        <Card className="p-5">
          <h2 className="font-bold dark:text-[#E8F0E4]">Goal achievement</h2>
          <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">FY26 reduction plan</p>
          <div className="mt-7 space-y-6">
            {[
              ['Renewable electricity', 82],
              ['Reduce business travel', 64],
              ['Zero waste to landfill', 43]
            ].map(([title, value]) => (
              <div key={title as string}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold dark:text-[#E8F0E4]">{title as string}</span>
                  <span className="font-bold text-[#397B14] dark:text-[#8ECA3C]">
                    {value as number}%
                  </span>
                </div>
                <ProgressBar value={value as number} />
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-8 w-full">
            {goalAccess === 'view' ? 'View environmental goals' : 'View environmental goals'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
