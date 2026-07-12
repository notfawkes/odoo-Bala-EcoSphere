"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Primitives';

export function SectionTabs({ tabs, disabledTabs = [] }: { tabs: string[]; disabledTabs?: string[]; }) {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-[#E6EFE0] bg-white p-1 dark:border-[#1E3319] dark:bg-[#162212]">
      {tabs.map((t) => (
        <button
          onClick={() => !disabledTabs.includes(t) && setActive(t)}
          key={t}
          disabled={disabledTabs.includes(t)}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active === t ? 'bg-[#EAF5E4] text-[#397B14] dark:bg-[#1E3319] dark:text-[#8ECA3C]' : disabledTabs.includes(t) ? 'cursor-not-allowed text-[#C5CEC2] dark:text-[#3A4A36]' : 'text-[#6B7280] hover:bg-[#F5F8F2] dark:text-[#8A9687] dark:hover:bg-[#1A2D16]'}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Kpi({ label, value, detail }: { label: string; value: string; detail: string; }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[#758171] dark:text-[#6B7B67]">
        {label}
      </p>
      <p className="mt-2 font-display text-5xl text-[#315b23] dark:text-[#8ECA3C]">{value}</p>
      <p className="mt-2 text-xs text-[#397B14] dark:text-[#6BCB3C]">{detail}</p>
    </Card>
  );
}

export function ViewOnlyBanner({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-xl border border-[#D8E8D0] bg-[#F0F7EB] px-4 py-3 text-sm font-medium text-[#42663a] dark:border-[#2A4222] dark:bg-[#1A2D16] dark:text-[#8ECA3C]">
      👁 {message}
    </div>
  );
}
