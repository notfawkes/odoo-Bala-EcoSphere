"use client";

import React, { useEffect, useState } from 'react';
import { PlusIcon, UsersIcon, Image as ImageIcon } from 'lucide-react';
import { departments } from '@/lib/mockData';
import {
  Button,
  Card,
  PageHeader,
  ProgressBar,
  StatusChip,
  Modal
} from '@/app/components/ui/Primitives';
import { useAuth } from '@/context/AuthContext';
import { getAccessLevel, canAccess } from '@/lib/permissions';
import { SectionTabs, Kpi } from '@/app/components/common/Shared';

export default function SocialPage() {
  const { role } = useAuth();
  const csrAccess = getAccessLevel(role, 'csr_activities');
  const approveAccess = canAccess(role, 'approve_csr');

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    start_date: '',
    end_date: '',
    status: 'Pending approval'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/employee/social/csr-projects');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching CSR projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (selectedFile) {
        data.append('file', selectedFile);
      }
      // Assuming organization ID exists
      data.append('organization_id', 'fa59dce1-4435-4f3c-a9e2-ac38836ac3ea');

      const res = await fetch('http://localhost:8000/admin/social/csr-projects', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        alert('Activity created successfully!');
        setShowModal(false);
        setFormData({
          title: '', description: '', budget: '', location: '', start_date: '', end_date: '', status: 'Pending approval'
        });
        setSelectedFile(null);
        fetchActivities();
      } else {
        const err = await res.text();
        alert('Failed to create activity: ' + err);
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Network error connecting to backend');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Social"
        title="PEOPLE & PURPOSE."
        description="See how employee participation and community work translate into measurable social value."
        action={
          csrAccess === 'full' ? (
            <Button onClick={() => setShowModal(true)}>
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
        <Kpi label="Participation rate" value="76%" detail="+9% since last quarter" />
        <Kpi label="Volunteer hours" value="1,284" detail="Across 18 programs" />
        <Kpi label="Training completion" value="93%" detail="Target: 90%" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold dark:text-[#E8F0E4]">CSR activities</h2>
              <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">Community impact this quarter</p>
            </div>
            {approveAccess && <StatusChip status={`${activities.filter((a: any) => a.status === 'Pending approval').length} pending`} />}
          </div>
          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-[#758171]">Loading...</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-[#758171]">No activities found.</p>
            ) : (
              activities.map((act: any) => (
                <div className="rounded-xl border border-[#E6EFE0] p-4 dark:border-[#1E3319]" key={act.project_id}>
                  <div className="flex gap-4">
                    {act.image_url ? (
                      <img src={act.image_url} alt={act.title} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-[#F4F9F2] dark:bg-[#152311] rounded-md flex items-center justify-center text-[#8ECA3C]">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold dark:text-[#E8F0E4]">{act.title}</p>
                          <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">
                            {act.budget ? `$${act.budget}` : ''} {act.location ? `• ${act.location}` : ''}
                          </p>
                        </div>
                        <StatusChip status={act.status || 'On track'} />
                      </div>
                      {act.description && <p className="mt-2 text-sm dark:text-[#C5D3BF]">{act.description}</p>}
                    </div>
                  </div>

                  {csrAccess === 'join' && act.status !== 'Complete' && (
                    <Button variant="secondary" className="mt-3 w-full text-xs h-8">Join activity</Button>
                  )}
                  {approveAccess && act.status === 'Pending approval' && (
                    <div className="mt-3 flex gap-2">
                      <Button className="flex-1 text-xs h-8">Approve</Button>
                      <Button variant="secondary" className="flex-1 text-xs h-8">Review</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold dark:text-[#E8F0E4]">Engagement by department</h2>
          <p className="mt-1 text-xs text-[#758171] dark:text-[#6B7B67]">Participation in active programs</p>
          <div className="mt-6 space-y-5">
            {departments.map((d) => (
              <div key={d.name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium dark:text-[#E8F0E4]">{d.name}</span>
                  <span className="font-bold text-[#397B14] dark:text-[#8ECA3C]">{Math.min(96, d.score)}%</span>
                </div>
                <ProgressBar value={Math.min(96, d.score)} color="#8ECA3C" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log CSR Activity">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="flex gap-2">
            <input type="number" className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Budget ($)" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            <input className="w-1/2 rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2 flex flex-col gap-1">
              <label className="text-xs text-[#758171]">Start Date</label>
              <input type="date" className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
            </div>
            <div className="w-1/2 flex flex-col gap-1">
              <label className="text-xs text-[#758171]">End Date</label>
              <input type="date" className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#758171]">Status</label>
            <select className="rounded-lg border border-[#E6EFE0] p-2 text-sm outline-none focus:border-[#8ECA3C] dark:border-[#1E3319] dark:bg-[#0F1A0D] dark:text-[#E8F0E4]" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="Pending approval">Pending approval</option>
              <option value="On track">On track</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#758171]">Cover Photo</label>
            <input type="file" accept="image/*" className="text-sm dark:text-[#E8F0E4]" onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }} />
          </div>
          <Button type="submit" disabled={isCreating} className="mt-2">{isCreating ? 'Saving...' : 'Save Activity'}</Button>
        </form>
      </Modal>
    </div>
  );
}