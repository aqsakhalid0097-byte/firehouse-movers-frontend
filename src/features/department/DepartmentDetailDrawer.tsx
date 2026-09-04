'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { X, User, ExternalLink } from "lucide-react";
import type { DepartmentItem } from "../../api/types";

interface DepartmentDetailDrawerProps {
  department: DepartmentItem | null;
  onClose: () => void;
}

export const DepartmentDetailDrawer: React.FC<DepartmentDetailDrawerProps> = ({
  department,
  onClose,
}) => {
  const router = useRouter();
  if (!department) return null;

  const memberList = department.members || [];
  const memberCount = department.employee_count ?? memberList.length;
  const managerName = department.manager?.full_name || "Unassigned";
  const managerTitle = department.manager?.job_title || "Department Lead";

  const handleMemberClick = (userId?: number) => {
    if (userId) {
      onClose();
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1a1a] border border-[#333333] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#333333] bg-gradient-to-br from-[#1a1a1a] via-[#262626] to-[#1a1a1a] rounded-t-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                {department.slug || "DIVISION"}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">{department.title}</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              {department.description || "Firehouse Movers operational department."}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#262626] p-4 rounded-xl border border-[#333333] text-center">
                <p className="text-xs text-gray-400 uppercase font-semibold">Total Members</p>
                <p className="text-xl font-bold text-white mt-1">{memberCount}</p>
              </div>
              <div className="bg-[#262626] p-4 rounded-xl border border-[#333333] text-center">
                <p className="text-xs text-gray-400 uppercase font-semibold">Your Status</p>
                <p className="text-sm font-bold text-emerald-400 mt-2">
                  {department.is_manager ? "Manager" : department.is_member ? "Member" : "Active Division"}
                </p>
              </div>
            </div>

            {/* Department Lead info */}
            <div className="bg-[#262626] rounded-xl p-4 border border-[#333333]">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
                Lead Manager
              </p>
              <div
                onClick={() => handleMemberClick(department.manager?.user_id || department.manager?.id)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white text-base">{managerName}</p>
                  <p className="text-xs text-gray-400">{managerTitle}</p>
                </div>
                {department.manager?.user_id && (
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                )}
              </div>
            </div>

            {/* Department Members List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  Assigned Team Members ({memberList.length})
                </h3>
              </div>

              {memberList.length === 0 ? (
                <p className="text-xs text-gray-400 italic p-4 bg-[#262626] rounded-xl border border-[#333333]">
                  No direct members currently listed in this division roster.
                </p>
              ) : (
                <div className="space-y-2">
                  {memberList.map((member) => (
                    <div
                      key={member.id || member.user_id}
                      onClick={() => handleMemberClick(member.user_id || member.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#262626] border border-[#333333] hover:border-red-500/50 hover:bg-[#2e2e2e] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 group-hover:text-red-400 transition-colors border border-[#333333]">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs group-hover:text-red-400 transition-colors">
                            {member.full_name}
                          </p>
                          <p className="text-[11px] text-gray-400">{member.job_title || "Team Member"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white">
                        <span>Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333333] bg-[#1a1a1a] rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#262626] hover:bg-[#333333] text-white border border-[#333333] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailDrawer;
