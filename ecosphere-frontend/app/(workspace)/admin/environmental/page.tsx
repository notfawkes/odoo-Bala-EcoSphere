"use client";

import React, { useEffect, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { transactions as mockTransactions } from '@/lib/mockData';
import {
  Button,
  Card,
  DataTable,
  FilterBar,
  PageHeader,
  ProgressBar,
  Modal
} from '@/app/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel } from '@/lib/permissions';
import { SectionTabs, Kpi, ViewOnlyBanner } from '@/app/components/common/Shared';

export default function EnvironmentalPage() {
  const { role } = useAuth();
  const emissionAccess = getAccessLevel(role, 'emission_factors');
  const goalAccess = getAccessLevel(role, 'environmental_goals');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [goalParams, setGoalParams] = useState({ category: 'Energy', title: '', target_value: 0, current_value: 0, unit: 'kWh', deadline: '2026-12-31', status: 'In Progress' });
  const [transactionParams, setTransactionParams] = useState({ emission_id: 'e1111111-1111-1111-1111-111111111111', reduction_amount: 0, description: '', completed_on: '2026-12-31', verified: true });
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    transactions: [] as any[],
    goals: [] as any[],
    factors: [] as any[],
    esgProfiles: [] as any[],
    ytdEmissions: 0,
    reductionTarget: "0%",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [transactionsRes, goalsRes, factorsRes, esgRes] = await Promise.all([
          fetch('http://localhost:8000/employee/environment/carbon-transactions'),
          fetch('http://localhost:8000/employee/environment/environmental-goals'),
          fetch('http://localhost:8000/employee/environment/emission-factors'),
          fetch('http://localhost:8000/employee/environment/product-esg')
        ]);

        const transactionsData = await transactionsRes.json();
        const goalsData = await goalsRes.json();
        const factorsData = await factorsRes.json();
        const esgData = await esgRes.json();

        let formattedTransactions = mockTransactions;
        if (transactionsData.items && transactionsData.items.length > 0) {
          formattedTransactions = transactionsData.items.map((t: any) => [
            t.reduction_id.split('-')[0], // reference
            'Operations', // mock department as it is not in response
            t.description,
            `-${t.reduction_amount} tCO2e`,
            t.verified ? 'Verified' : 'Pending'
          ]);
        } else {
            formattedTransactions = [];
        }

        let formattedGoals = [];
        let rawGoals = [];
        if (goalsData.items && goalsData.items.length > 0) {
          rawGoals = goalsData.items.map((g: any) => [
            g.goal_id.split('-')[0],
            g.category,
            g.title,
            `${g.current_value} / ${g.target_value} ${g.unit}`,
            g.status
          ]);
          formattedGoals = goalsData.items.map((g: any) => ({
            title: g.title,
            value: Math.round((g.current_value / g.target_value) * 100) || 0
          }));
        }

        let totalEmissions = 0;
        let formattedFactors = [];
        if (factorsData.items && factorsData.items.length > 0) {
          factorsData.items.forEach((f: any) => {
            totalEmissions += f.quantity;
          });
          formattedFactors = factorsData.items.map((f: any) => [
            f.emission_id.split('-')[0],
            f.department,
            f.emission_source,
            `${f.quantity} ${f.unit}`,
            new Date(f.reporting_month).toLocaleDateString()
          ]);
        }

        let formattedEsg = [];
        if (esgData.items && esgData.items.length > 0) {
            formattedEsg = esgData.items.map((e: any) => [
                e.score_id.split('-')[0],
                new Date(e.calculated_on).toLocaleDateString(),
                e.environmental_score,
                e.social_score,
                e.governance_score,
                e.overall_score
            ]);
        }

        setData({
          transactions: formattedTransactions,
          goals: formattedGoals,
          factors: formattedFactors,
          esgProfiles: formattedEsg,
          rawGoals,
          ytdEmissions: Math.round(totalEmissions),
          reductionTarget: "68%" // mock target
        } as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('http://localhost:8000/admin/environment/environmental-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: 'fa59dce1-4435-4f3c-a9e2-ac38836ac3ea',
          category: goalParams.category,
          title: goalParams.title,
          target_value: Number(goalParams.target_value),
          current_value: Number(goalParams.current_value),
          unit: goalParams.unit,
          deadline: goalParams.deadline,
          status: goalParams.status
        })
      });
      if (res.ok) {
        alert('Goal created successfully! Refresh to see updates.');
        setShowGoalModal(false);
      } else {
        const errorText = await res.text();
        alert('Failed to create goal: ' + errorText);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Error connecting to backend');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('http://localhost:8000/admin/environment/carbon-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emission_id: transactionParams.emission_id || undefined,
          reduction_amount: Number(transactionParams.reduction_amount),
          description: transactionParams.description,
          completed_on: transactionParams.completed_on,
          verified: transactionParams.verified
        })
      });
      if (res.ok) {
        alert('Transaction added successfully! Refresh to see updates.');
        setShowTransactionModal(false);
      } else {
        alert('Failed to add transaction');
      }
    } catch (error) {
       alert('Error connecting to backend');
    } finally {
      setIsCreating(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'Overview') {
        return (
            <>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Kpi label="YTD emissions" value={loading ? "..." : data.ytdEmissions.toString()} detail="tCO₂e • −12.6% YoY" />
                    <Kpi label="Reduction target" value={loading ? "..." : data.reductionTarget} detail="On track for FY26" />
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
                    {loading ? (
                        <div className="p-5 text-sm text-[#758171]">Loading...</div>
                    ) : (
                        <DataTable
                        headings={['Reference', 'Department', 'Activity', 'Impact', 'Status']}
                        rows={data.transactions}
                        />
                    )}
                    </Card>
                    <Card className="p-5">
                    <h2 className="font-bold dark:text-[#E8F0E4]">Goal achievement</h2>
                    <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">FY26 reduction plan</p>
                    <div className="mt-7 space-y-6">
                        {loading ? (
                        <div className="text-sm text-[#758171]">Loading...</div>
                        ) : (
                            data.goals.map((g: any) => (
                            <div key={g.title}>
                                <div className="mb-2 flex justify-between text-sm">
                                <span className="font-semibold dark:text-[#E8F0E4]">{g.title}</span>
                                <span className="font-bold text-[#397B14] dark:text-[#8ECA3C]">
                                    {g.value}%
                                </span>
                                </div>
                                <ProgressBar value={g.value} />
                            </div>
                            ))
                        )}
                    </div>
                    <Button variant="secondary" className="mt-8 w-full" onClick={() => setActiveTab('Goals')}>
                        {goalAccess === 'view' ? 'View environmental goals' : 'Manage environmental goals'}
                    </Button>
                    </Card>
                </div>
            </>
        );
    }

    if (activeTab === 'Emission factors') {
        return (
            <Card>
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold dark:text-[#E8F0E4]">Emission Factors</h2>
                        <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">Detailed emissions tracking</p>
                    </div>
                    <FilterBar placeholder="Search emission factors..." />
                </div>
                {loading ? (
                    <div className="p-5 text-sm text-[#758171]">Loading...</div>
                ) : (
                    <DataTable
                        headings={['ID', 'Department', 'Source', 'Quantity', 'Reporting Month']}
                        rows={data.factors}
                    />
                )}
            </Card>
        );
    }

    if (activeTab === 'Product ESG profiles') {
        return (
            <Card>
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold dark:text-[#E8F0E4]">Product ESG Profiles</h2>
                        <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">ESG score records</p>
                    </div>
                    <FilterBar placeholder="Search ESG profiles..." />
                </div>
                {loading ? (
                    <div className="p-5 text-sm text-[#758171]">Loading...</div>
                ) : (
                    <DataTable
                        headings={['ID', 'Date', 'Environmental', 'Social', 'Governance', 'Overall']}
                        rows={data.esgProfiles}
                    />
                )}
            </Card>
        );
    }

    if (activeTab === 'Carbon transactions') {
        return (
            <Card>
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold dark:text-[#E8F0E4]">Carbon Transactions</h2>
                        <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">All recorded transactions</p>
                    </div>
                    <FilterBar placeholder="Search transactions..." />
                </div>
                {loading ? (
                    <div className="p-5 text-sm text-[#758171]">Loading...</div>
                ) : (
                    <DataTable
                        headings={['Reference', 'Department', 'Activity', 'Impact', 'Status']}
                        rows={data.transactions}
                    />
                )}
            </Card>
        );
    }

    if (activeTab === 'Goals') {
        return (
            <Card>
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold dark:text-[#E8F0E4]">Environmental Goals</h2>
                        <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">All tracked goals</p>
                    </div>
                    <FilterBar placeholder="Search goals..." />
                </div>
                {loading ? (
                    <div className="p-5 text-sm text-[#758171]">Loading...</div>
                ) : (
                    <DataTable
                        headings={['ID', 'Category', 'Title', 'Progress', 'Status']}
                        rows={(data as any).rawGoals || []}
                    />
                )}
            </Card>
        );
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Environmental"
        title="FOOTPRINT CONTROL."
        description="Measure, manage, and reduce operational impact with one defensible environmental record."
        action={
          role === 'admin' ? (
            <div className="flex gap-2">
              <Button onClick={() => setShowGoalModal(true)}>
                <PlusIcon size={16} /> Add Goal
              </Button>
              <Button onClick={() => setShowTransactionModal(true)}>
                <PlusIcon size={16} /> Add Transaction
              </Button>
            </div>
          ) : undefined
        }
      />
      
      {emissionAccess === 'view' && <ViewOnlyBanner message="You have view-only access to emission factors." />}

      <SectionTabs
        tabs={['Overview', 'Emission factors', 'Product ESG profiles', 'Carbon transactions', 'Goals']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        disabledTabs={emissionAccess === 'view' ? [] : emissionAccess === 'none' ? ['Emission factors', 'Carbon transactions'] : []}
      />
      
      {renderContent()}

      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Add Environmental Goal">
        <form onSubmit={handleCreateGoal} className="flex flex-col gap-4">
          <input className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Title" required value={goalParams.title} onChange={e => setGoalParams({...goalParams, title: e.target.value})} />
          <input className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Category" required value={goalParams.category} onChange={e => setGoalParams({...goalParams, category: e.target.value})} />
          <div className="flex gap-2">
            <input type="number" className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Target Value" required value={goalParams.target_value || ''} onChange={e => setGoalParams({...goalParams, target_value: Number(e.target.value)})} />
            <input type="number" className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Current Value" required value={goalParams.current_value || ''} onChange={e => setGoalParams({...goalParams, current_value: Number(e.target.value)})} />
          </div>
          <div className="flex gap-2">
            <input className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Unit (e.g., kWh)" required value={goalParams.unit} onChange={e => setGoalParams({...goalParams, unit: e.target.value})} />
            <input type="date" className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" required value={goalParams.deadline} onChange={e => setGoalParams({...goalParams, deadline: e.target.value})} />
          </div>
          <Button type="submit" disabled={isCreating} className="mt-2">{isCreating ? 'Creating...' : 'Save Goal'}</Button>
        </form>
      </Modal>

      <Modal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} title="Add Carbon Transaction">
        <form onSubmit={handleCreateTransaction} className="flex flex-col gap-4">
          <input className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Description" required value={transactionParams.description} onChange={e => setTransactionParams({...transactionParams, description: e.target.value})} />
          <div className="flex gap-2">
            <input type="number" step="0.1" className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Reduction Amount" required value={transactionParams.reduction_amount || ''} onChange={e => setTransactionParams({...transactionParams, reduction_amount: Number(e.target.value)})} />
            <input type="date" className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" required value={transactionParams.completed_on} onChange={e => setTransactionParams({...transactionParams, completed_on: e.target.value})} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="verified" checked={transactionParams.verified} onChange={e => setTransactionParams({...transactionParams, verified: e.target.checked})} className="accent-[#499A13]" />
            <label htmlFor="verified" className="text-sm dark:text-[#E8F0E4]">Verified Transaction</label>
          </div>
          <Button type="submit" disabled={isCreating} className="mt-2">{isCreating ? 'Creating...' : 'Save Transaction'}</Button>
        </form>
      </Modal>
    </div>
  );
}
//..........