import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { Status } from '@/app/types/index';
type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
};
export function Card({ children, className = '', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={`rounded-2xl border border-[#E6EFE0] bg-white shadow-[0_10px_30px_rgba(39,74,24,0.05)] dark:border-[#1E3319] dark:bg-[#162212] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${className}`}>
      
      {children}
    </Tag>);

}
export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {eyebrow: string;title: string;description: string;action?: React.ReactNode;}) {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#499A13] dark:text-[#8ECA3C]">
          {eyebrow}
        </p>
        <h1 className="font-display text-5xl leading-none tracking-wide text-[#1B1B1B] dark:text-[#E8F0E4] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6B7280] dark:text-[#8A9687]">{description}</p>
      </div>
      {action}
    </header>);

}
export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'secondary' | 'ghost';}) {
  const styles =
  variant === 'primary' ?
  'bg-[#499A13] text-white hover:bg-[#3c8010] dark:bg-[#4DA616] dark:hover:bg-[#5BBF1A]' :
  variant === 'secondary' ?
  'border border-[#D4E6C9] bg-white text-[#35592D] hover:bg-[#F5FAF1] dark:border-[#2A4222] dark:bg-[#162212] dark:text-[#C8E6B8] dark:hover:bg-[#1A2D16]' :
  'text-[#42663a] hover:bg-[#F0F6EC] dark:text-[#8ECA3C] dark:hover:bg-[#1A2D16]';
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#8ECA3C] focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-[#0F1A0D] ${styles} ${className}`}
      {...props}>
      
      {children}
    </button>);

}
export function StatusChip({ status }: {status: Status | string;}) {
  const tone =
  status === 'Complete' ||
  status === 'Verified' ||
  status === 'Ready' ||
  status === 'On track' ?
  'bg-[#EAF7E7] text-[#247338] dark:bg-[#1A3318] dark:text-[#6BCB3C]' :
  status === 'Needs review' || status === 'In review' ?
  'bg-[#FFF6E1] text-[#A36300] dark:bg-[#2D2510] dark:text-[#F0B429]' :
  status === 'Open' || status === 'Draft' ?
  'bg-[#F1F4F0] text-[#647166] dark:bg-[#1A2218] dark:text-[#8A9687]' :
  'bg-[#FDECEC] text-[#B42318] dark:bg-[#2D1414] dark:text-[#F87171]';
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      
      {status}
    </span>);

}
export function ProgressBar({
  value,
  color = '#499A13'
}: {value: number;color?: string;}) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-[#EDF3E9] dark:bg-[#1E3319]"
      aria-label={`${value}% complete`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}>
      
      <motion.div
        initial={{
          width: 0
        }}
        animate={{
          width: `${value}%`
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}
        className="h-full rounded-full"
        style={{
          backgroundColor: color
        }} />
      
    </div>);

}
export function FilterBar({
  placeholder = 'Search records...'
}: {placeholder?: string;}) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#E6EFE0] bg-white p-3 dark:border-[#1E3319] dark:bg-[#162212] sm:flex-row">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#F7FAF5] px-3 py-2 text-sm text-[#6B7280] dark:bg-[#0F1A0D] dark:text-[#8A9687]">
        <SearchIcon size={16} />
        <input
          className="w-full bg-transparent outline-none placeholder:text-[#98A396] dark:placeholder:text-[#5A6B56]"
          placeholder={placeholder}
          aria-label={placeholder} />
        
      </label>
      <button className="flex items-center justify-between gap-8 rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm font-medium text-[#496046] dark:border-[#1E3319] dark:text-[#8A9687]">
        All departments <ChevronDownIcon size={16} />
      </button>
      <button className="flex items-center justify-between gap-8 rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm font-medium text-[#496046] dark:border-[#1E3319] dark:text-[#8A9687]">
        This quarter <ChevronDownIcon size={16} />
      </button>
    </div>);

}
export function DataTable({
  headings,
  rows
}: {headings: string[];rows: string[][];}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#E6EFE0] text-[11px] uppercase tracking-wider text-[#7A8577] dark:border-[#1E3319] dark:text-[#6B7B67]">
            {headings.map((heading) =>
            <th className="px-5 py-3 font-bold" key={heading}>
                {heading}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) =>
          <tr
            className="border-b border-[#F0F4EE] last:border-0 dark:border-[#1A2D16]"
            key={`${row[0]}-${index}`}>
            
              {row.map((cell, cellIndex) =>
            <td
              className="px-5 py-4 text-[#3C4739] dark:text-[#C8E6B8]"
              key={`${cell}-${cellIndex}`}>
              
                  {cellIndex === row.length - 1 ?
              <StatusChip status={cell} /> :

              cell
              }
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}