import React, { useState } from 'react';
import { X, Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { useTeamAvailableUsers, useAddTeamMember } from '../../api/staffPortalApi';
import type { RoleChoice } from '../../api/types';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: RoleChoice[];
  onSuccess?: () => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  roles,
  onSuccess,
}) => {
  const { data: availableUsers, isLoading: isLoadingUsers } = useTeamAvailableUsers();
  const addMutation = useAddTeamMember();

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('driver');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedUserId('');
    setSelectedRole('driver');
    setJobTitle('');
    setStartDate('');
    setErrorMsg(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setErrorMsg('Please select a user to add.');
      return;
    }

    try {
      await addMutation.mutateAsync({
        user_id: Number(selectedUserId),
        role: selectedRole,
        job_title: jobTitle.trim(),
        start_date: startDate || null,
      });
      handleClose();
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to add team member. Please try again.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-red-500 flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            <span>Add Team Member</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select User */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Select User <span className="text-red-400">*</span>
            </label>
            {isLoadingUsers ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span>Loading available users...</span>
              </div>
            ) : !availableUsers || availableUsers.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                No eligible unassigned users available to add.
              </p>
            ) : (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-red-500 text-sm"
              >
                <option value="">-- Choose User --</option>
                {availableUsers.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.full_name} ({user.email}) - {user.role_display || user.role}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Select Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Select Role <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
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
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Driver, Lead Mover, Logistics Specialist"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">e.g., Senior Driver, Warehouse Specialist</p>
          </div>

          {/* Date Joined */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
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
              disabled={addMutation.isPending || !selectedUserId}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
            >
              {addMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Add Member</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
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
