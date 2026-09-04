import React, { useState } from 'react';
import { X, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useRemoveTeamMember } from '../../api/staffPortalApi';
import type { TeamMember } from '../../api/types';

interface RemoveTeamMemberModalProps {
  isOpen: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RemoveTeamMemberModal: React.FC<RemoveTeamMemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onSuccess,
}) => {
  const removeMutation = useRemoveTeamMember();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !member) return null;

  const handleRemove = async () => {
    try {
      await removeMutation.mutateAsync(member.user_id);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to remove team member.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Confirm Removal</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
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

        <p className="text-gray-300 text-sm leading-relaxed">
          Are you sure you want to remove <strong className="text-white font-bold">{member.full_name}</strong> from your team?
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeMutation.isPending}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            {removeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
