"use client";

import React, { useEffect, useState } from 'react';
import { PlusIcon, ShieldAlertIcon, XIcon, CalendarIcon, AlertCircleIcon, BellIcon } from 'lucide-react';

import {
  Button,
  Card,
  DataTable,
  FilterBar,
  PageHeader
} from '../../../components/ui/Primitives';
import { SectionTabs, Kpi, ViewOnlyBanner } from '../../../components/common/Shared';

export default function GovernancePage() {
  const policyAccess: string = 'full';
  const auditAccess: boolean = true;
  
  const [activeTab, setActiveTab] = useState('Policies');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [policies, setPolicies] = useState<any[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [complianceIssues, setComplianceIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPolicy, setNewPolicy] = useState({
    policy_name: '', category: '', version: '1.0', effective_date: new Date().toISOString().split('T')[0], expiry_date: '', owner: '00000000-0000-0000-0000-000000000000', status: 'Draft', organization_id: '00000000-0000-0000-0000-000000000000'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [polRes, ackRes, audRes, compRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/governance/policies").then(r => r.json()).catch(() => []),
        fetch("http://127.0.0.1:8000/governance/acknowledgements").then(r => r.json()).catch(() => []),
        fetch("http://127.0.0.1:8000/governance/audits").then(r => r.json()).catch(() => []),
        fetch("http://127.0.0.1:8000/governance/compliance").then(r => r.json()).catch(() => [])
      ]);

      setPolicies(Array.isArray(polRes) ? polRes : []);
      setAcknowledgements(Array.isArray(ackRes) ? ackRes : []);
      setAudits(Array.isArray(audRes) ? audRes : []);
      setComplianceIssues(Array.isArray(compRes) ? compRes : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...newPolicy };
      if (!payload.expiry_date) {
        payload.expiry_date = null as any;
      }

      const res = await fetch("http://127.0.0.1:8000/governance/policies", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Process rows
  const policyRows = (policies || []).map((policy: any) => [
    policy.policy_id?.slice(0, 8) || 'N/A',
    policy.policy_name || 'N/A',
    policy.category || 'N/A',
    policy.expiry_date || "N/A",
    policy.status || 'N/A'
  ]);

  const ackRows = (acknowledgements || []).map((ack: any) => [
    ack.user_id?.slice(0, 8) || 'Employee',
    "Finance",
    ack.policy_id?.slice(0, 8) || 'Policy',
    "2026-06-01",
    ack.acknowledged_at || "N/A",
    ack.status || 'N/A'
  ]);

  const auditRows = (audits || []).map((audit: any) => [
    audit.audit_name || 'N/A',
    audit.audit_type || 'N/A',
    audit.auditor || 'N/A',
    audit.scheduled_date || 'N/A',
    audit.status || 'N/A'
  ]);

  const complianceRows = (complianceIssues || []).map((issue: any) => [
    issue.department || 'N/A',
    issue.policy_id?.slice(0, 8) || 'N/A',
    `${issue.compliance_percent || 0}%`,
    issue.checked_on || 'N/A',
    issue.remarks || 'N/A'
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Governance"
        title="TRUST, BY DESIGN."
        description="Maintain policy discipline, clear audit trails, and a live view of compliance risk."
        action={
          policyAccess === 'full' && activeTab === 'Policies' ? (
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon size={16} /> Create policy
            </Button>
          ) : undefined
        }
      />

      {policyAccess === 'view' && <ViewOnlyBanner message="You have view-only access to policies." />}

      <SectionTabs
        tabs={['Policies', 'Acknowledgements', 'Audits', 'Compliance issues']}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Policies Tab */}
      {activeTab === 'Policies' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Policy acknowledgement" value="94%" detail="32 acknowledgements outstanding" />
            <Kpi label="Open audit items" value="7" detail="2 require attention" />
            <Kpi label="Compliance score" value="91" detail="+2 points this quarter" />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <Card>
              <div className="p-5">
                <h2 className="font-bold dark:text-[#E8F0E4]">Policy register</h2>
                <FilterBar placeholder="Search policies..." />
              </div>
              {loading ? <p className="px-5 pb-5">Loading...</p> : (
                <DataTable
                  headings={["ID", "Policy", "Category", "Next action", "Status"]}
                  rows={policyRows}
                />
              )}
            </Card>
            <Card className="p-5">
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
            </Card>
          </div>
        </>
      )}

      {/* Acknowledgements Tab */}
      {activeTab === 'Acknowledgements' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Overall Acknowledgement" value="88%" detail="Across all departments" />
            <Kpi label="Pending Acknowledgements" value="45" detail="Requires attention" />
            <Kpi label="Overdue Acknowledgements" value="12" detail="Escalated to HR" />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <Card>
              <div className="p-5">
                <h2 className="font-bold dark:text-[#E8F0E4]">Acknowledgements Tracking</h2>
                <FilterBar placeholder="Search employee or department..." />
              </div>
              {loading ? <p className="px-5 pb-5">Loading...</p> : (
                <DataTable
                  headings={["Employee", "Department", "Policy", "Assigned Date", "Acknowledged Date", "Status"]}
                  rows={ackRows}
                />
              )}
            </Card>
            <Card className="p-5">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF7E7] text-[#247338] dark:bg-[#1A3318] dark:text-[#6BCB3C]">
                  <BellIcon size={19} />
                </span>
                <div>
                  <h2 className="font-bold dark:text-[#E8F0E4]">Acknowledgement Alerts</h2>
                  <p className="text-xs text-[#758171] dark:text-[#6B7B67]">Pending & Reminders</p>
                </div>
              </div>
              <div className="mt-6 space-y-5 border-l border-[#D8E8D0] pl-5 dark:border-[#2A4222]">
                {[
                  ['Today', 'Finance Policy pending'],
                  ['Tomorrow', 'Data Privacy reminder'],
                  ['Next Week', 'Annual Code of Conduct']
                ].map(([date, item]) => (
                  <div key={date}>
                    <p className="text-xs font-bold text-[#499A13] dark:text-[#8ECA3C]">{date}</p>
                    <p className="mt-1 text-sm leading-5 text-[#52604E] dark:text-[#8A9687]">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Audits Tab */}
      {activeTab === 'Audits' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Total Audits" value="24" detail="This fiscal year" />
            <Kpi label="Open Audits" value="3" detail="In progress" />
            <Kpi label="High Severity Findings" value="1" detail="Critical attention needed" />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <Card>
              <div className="p-5">
                <h2 className="font-bold dark:text-[#E8F0E4]">Audit Register</h2>
                <FilterBar placeholder="Search audits..." />
              </div>
              {loading ? <p className="px-5 pb-5">Loading...</p> : (
                <DataTable
                  headings={["Audit Name", "Type", "Auditor", "Scheduled Date", "Status"]}
                  rows={auditRows}
                />
              )}
            </Card>
            <Card className="p-5">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F7EB] text-[#42663a] dark:bg-[#1A2D16] dark:text-[#8ECA3C]">
                  <CalendarIcon size={19} />
                </span>
                <div>
                  <h2 className="font-bold dark:text-[#E8F0E4]">Upcoming Audits</h2>
                  <p className="text-xs text-[#758171] dark:text-[#6B7B67]">Scheduled timeline</p>
                </div>
              </div>
              <div className="mt-6 space-y-5 border-l border-[#D8E8D0] pl-5 dark:border-[#2A4222]">
                {[
                  ['25 June', 'Internal Audit'],
                  ['5 July', 'ESG Compliance Review'],
                  ['12 July', 'Supplier Audit']
                ].map(([date, item]) => (
                  <div key={date}>
                    <p className="text-xs font-bold text-[#499A13] dark:text-[#8ECA3C]">{date}</p>
                    <p className="mt-1 text-sm leading-5 text-[#52604E] dark:text-[#8A9687]">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Compliance Issues Tab */}
      {activeTab === 'Compliance issues' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Compliance Score" value="92" detail="Target: 95+" />
            <Kpi label="Open Issues" value="14" detail="Active violations" />
            <Kpi label="Critical Issues" value="2" detail="Immediate action required" />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <Card>
              <div className="p-5">
                <h2 className="font-bold dark:text-[#E8F0E4]">Compliance Log</h2>
                <FilterBar placeholder="Search departments or policies..." />
              </div>
              {loading ? <p className="px-5 pb-5">Loading...</p> : (
                <DataTable
                  headings={["Department", "Policy", "Compliance %", "Checked On", "Remarks"]}
                  rows={complianceRows}
                />
              )}
            </Card>
            <Card className="p-5">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FDECEC] text-[#B42318] dark:bg-[#2D1414] dark:text-[#F87171]">
                  <AlertCircleIcon size={19} />
                </span>
                <div>
                  <h2 className="font-bold dark:text-[#E8F0E4]">Compliance Alerts</h2>
                  <p className="text-xs text-[#758171] dark:text-[#6B7B67]">Critical issues</p>
                </div>
              </div>
              <div className="mt-6 space-y-5 border-l border-[#D8E8D0] pl-5 dark:border-[#2A4222]">
                {[
                  ['Finance policy expired'],
                  ['Supplier documentation missing'],
                  ['Data retention overdue']
                ].map(([item]) => (
                  <div key={item}>
                    <p className="text-xs font-bold text-[#B42318] dark:text-[#F87171]">Critical</p>
                    <p className="mt-1 text-sm leading-5 text-[#52604E] dark:text-[#8A9687]">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Create Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold dark:text-[#E8F0E4]">Create Policy</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B7280] hover:text-black dark:text-[#8A9687] dark:hover:text-white">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold dark:text-[#C8E6B8]">Policy Name</label>
                <input
                  type="text" required
                  className="w-full rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm outline-none focus:border-[#499A13] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-white dark:focus:border-[#8ECA3C]"
                  value={newPolicy.policy_name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, policy_name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold dark:text-[#C8E6B8]">Category</label>
                <input
                  type="text" required
                  className="w-full rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm outline-none focus:border-[#499A13] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-white dark:focus:border-[#8ECA3C]"
                  value={newPolicy.category}
                  onChange={(e) => setNewPolicy({ ...newPolicy, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-[#C8E6B8]">Version</label>
                  <input
                    type="text" required
                    className="w-full rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm outline-none focus:border-[#499A13] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-white dark:focus:border-[#8ECA3C]"
                    value={newPolicy.version}
                    onChange={(e) => setNewPolicy({ ...newPolicy, version: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-[#C8E6B8]">Status</label>
                  <select
                    className="w-full rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm outline-none focus:border-[#499A13] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-white dark:focus:border-[#8ECA3C]"
                    value={newPolicy.status}
                    onChange={(e) => setNewPolicy({ ...newPolicy, status: e.target.value })}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-[#C8E6B8]">Effective Date</label>
                  <input
                    type="date" required
                    className="w-full rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm outline-none focus:border-[#499A13] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-white dark:focus:border-[#8ECA3C]"
                    value={newPolicy.effective_date}
                    onChange={(e) => setNewPolicy({ ...newPolicy, effective_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-[#C8E6B8]">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-[#E6EFE0] px-3 py-2 text-sm outline-none focus:border-[#499A13] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-white dark:focus:border-[#8ECA3C]"
                    value={newPolicy.expiry_date}
                    onChange={(e) => setNewPolicy({ ...newPolicy, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Policy</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}