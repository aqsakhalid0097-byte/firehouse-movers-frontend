'use client';

import React, { useState } from 'react';
import { ClipboardCheck, Shield, CheckCircle2, Camera, FileCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface SiteCheckItem {
  id: string;
  section: string;
  label: string;
  checked: boolean;
  notes?: string;
}

const defaultChecklist: SiteCheckItem[] = [
  { id: '1', section: 'Access & Parking', label: 'Driveway & street parking clear for 26ft truck clearance', checked: true },
  { id: '2', section: 'Access & Parking', label: 'Stairwell & elevator padding installed & protected', checked: true },
  { id: '3', section: 'Interior Protection', label: 'Door jamb protectors & floor neoprene runners placed', checked: true },
  { id: '4', section: 'Interior Protection', label: 'Bannister and railing quilts strapped securely', checked: false, notes: 'Quilts being added by crew lead.' },
  { id: '5', section: 'High-Value Items', label: 'Specialty inventory & art/marble condition verified with customer', checked: true },
  { id: '6', section: 'Safety & Egress', label: 'Clear walking path maintained; no trip hazards in corridors', checked: true },
];

export const OnsiteInspectionPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [jobId, setJobId] = useState('JOB-88421 (Dallas to Frisco)');
  const [items, setItems] = useState<SiteCheckItem[]>(defaultChecklist);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = items.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar isAuthenticated={true} user={user} onLogout={logout} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" /> IsManager On-Site Quality Control
            </div>
            <h1 className="animate-heading text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <ClipboardCheck className="w-7 h-7 text-red-500" />
              On-Site Job Inspection & Property Audit
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Verify pre-move and post-move property conditions, safety compliance, and customer sign-off.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="JOB-88421 (Dallas to Frisco)">JOB-88421 (Dallas to Frisco)</option>
              <option value="JOB-88422 (Plano Luxury Estate)">JOB-88422 (Plano Luxury Estate)</option>
              <option value="JOB-88423 (Fort Worth Commercial)">JOB-88423 (Fort Worth Commercial)</option>
            </select>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-gray-400 font-medium">Selected Job</span>
            <p className="text-sm font-bold text-white mt-1 truncate">{jobId}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Crew Lead: Marcus Vance</p>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-emerald-400 font-medium">Readiness</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount} / {items.length}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Checkpoints verified</p>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-sky-400 font-medium">Property Type</span>
            <p className="text-base font-bold text-white mt-1">Single Family Home</p>
            <p className="text-[11px] text-gray-500 mt-0.5">4,200 sq ft • 2 Levels</p>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <span className="text-xs text-purple-400 font-medium">Manager Clearance</span>
            <p className="text-base font-bold text-white mt-1">Authorized</p>
            <p className="text-[11px] text-purple-300 mt-0.5">Manager or Above</p>
          </Card>
        </div>

        {/* Inspection Form */}
        <Card className="p-6 bg-slate-900/60 border-slate-800" title="Job Site Inspection Checklist">
          {isCompleted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">On-Site Inspection Certified</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Site condition checklist and customer walk-through report logged successfully.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompleted(false)}
              >
                Edit Site Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-slate-800">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-700 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                          {item.section}
                        </span>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        {item.notes && <p className="text-xs text-amber-400/90 mt-0.5">{item.notes}</p>}
                      </div>
                    </div>

                    <Badge variant={item.checked ? 'success' : 'warning'}>
                      {item.checked ? 'Passed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Camera className="w-4 h-4 text-gray-400" />
                  Site photos captured: Entry, stairs, hardwood floor runners
                </div>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<FileCheck className="w-4 h-4" />}
                  onClick={() => setIsCompleted(true)}
                >
                  Certify On-Site Inspection
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default OnsiteInspectionPage;
