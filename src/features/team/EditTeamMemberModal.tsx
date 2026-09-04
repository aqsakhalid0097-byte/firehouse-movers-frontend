import React, { useState, useEffect } from 'react';
import { X, Loader2, Edit3, AlertCircle } from 'lucide-react';
import { useEditTeamMember } from '../../api/staffPortalApi';
import type { TeamMember, RoleChoice } from '../../api/types';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  member: TeamMember | null;
  roles: RoleChoice[];
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({
  isOpen,
  member,
  roles,
  onClose,
  onSuccess,
}) => {
  const editMutation = useEditTeamMember();

  const [role, setRole] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setRole(member.role || 'driver');
      setJobTitle(member.job_title || '');
      setStartDate(member.start_date || '');
      setErrorMsg(null);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editMutation.mutateAsync({
        userId: member.user_id,
        payload: {
          role,
          job_title: jobTitle.trim(),
          start_date: startDate || null,
        },
      });
      onClose();
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update team member. Please try again.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-red-500 flex items-center gap-2">
            <Edit3 className="w-6 h-6" />
            <span>Edit Team Member Profile</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-[#262626] p-3 rounded-lg border border-neutral-700">
          <img
            src={member.profile_picture || '/images/user_icon.jpg'}
            alt={member.full_name}
            className="w-12 h-12 rounded-full object-cover border border-neutral-600"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/user_icon.jpg';
            }}
          />
          <div>
            <p className="text-white font-bold text-sm">{member.full_name}</p>
            <p className="text-gray-400 text-xs">{member.email}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Assign Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Assign Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-red-500 text-sm"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Driver, Warehouse Manager"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
            />
          </div>

          {/* Date Joined */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Date Joined
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-red-500 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={editMutation.isPending}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
            >
              {editMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
