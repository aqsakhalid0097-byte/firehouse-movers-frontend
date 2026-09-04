'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Phone, Calendar, User, ExternalLink, Loader2 } from "lucide-react";
import type { PeopleDirectoryMember } from "../../api/types";
import { useProfile } from "../../api/staffPortalApi";
import { getMediaUrl } from "../../utils/media";

interface MemberDetailModalProps {
  member: PeopleDirectoryMember | null;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  const router = useRouter();
  const userId = member?.user_id || member?.id;
  const { data: profileResponse, isLoading } = useProfile(userId);

  if (!member) return null;

  const displayName = member.full_name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Employee';
  const roleDisplay = member.role_display || member.role || 'Staff Member';
  const departmentName = member.department_title || profileResponse?.profile?.department_title || 'General Operations';
  const avatarUrl = getMediaUrl(profileResponse?.profile?.profile_picture || member.profile_picture);
  const email = profileResponse?.user?.email || `${(member.first_name || 'staff').toLowerCase()}@firehousemovers.com`;
  const phone = profileResponse?.profile?.phone_number || 'Not Set';
  const location = profileResponse?.profile?.location || 'Lewisville, TX';
  const startDate = profileResponse?.profile?.start_date || 'May 2022';
  const tenure = profileResponse?.profile?.tenure;
  const hobbies = profileResponse?.profile?.hobbies;
  const quote = profileResponse?.profile?.favourite_quote;

  const handleNavigateToProfile = () => {
    onClose();
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header matching ProfileHeader */}
        <div className="relative p-6 sm:p-8 border-b border-[#333333] bg-gradient-to-br from-[#1a1a1a] via-[#262626] to-[#1a1a1a]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-5">
            <img
              src={avatarUrl}
              alt={displayName}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/images/user_icon.jpg")) {
                  target.src = "/images/user_icon.jpg";
                }
              }}
              className="w-20 h-20 rounded-full object-cover border-2 border-red-500 shadow-xl bg-[#262626]"
            />
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {displayName}
              </h2>
              <p className="text-base font-bold text-red-500">{roleDisplay}</p>
              <p className="text-xs text-gray-400 mt-0.5">{departmentName}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-4 text-gray-400 gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span>Fetching live profile details...</span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#262626] p-4 rounded-xl border border-[#333333] text-center">
              <p className="text-xs text-gray-400 uppercase font-semibold">User ID</p>
              <p className="text-xl font-bold text-white mt-1">#{userId}</p>
            </div>
            <div className="bg-[#262626] p-4 rounded-xl border border-[#333333] text-center">
              <p className="text-xs text-gray-400 uppercase font-semibold">Tenure</p>
              <p className="text-sm font-bold text-amber-400 mt-2">{tenure || "Active"}</p>
            </div>
            <div className="bg-[#262626] p-4 rounded-xl border border-[#333333] text-center">
              <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
              <p className="text-sm font-bold text-emerald-400 mt-2">Active</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#262626] rounded-xl p-5 border border-[#333333] space-y-3">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">
              Contact & Staff Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                <span>Joined: {startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-red-400 shrink-0" />
                <span>Location: {location}</span>
              </div>
            </div>
          </div>

          {/* Quote / Hobbies if available */}
          {(quote || hobbies) && (
            <div className="bg-[#262626] rounded-xl p-5 border border-[#333333] space-y-2 text-xs">
              {quote && (
                <div>
                  <span className="text-gray-400 font-semibold block mb-0.5">Favourite Quote:</span>
                  <p className="text-white italic">"{quote}"</p>
                </div>
              )}
              {hobbies && (
                <div className="pt-2 border-t border-[#333333]">
                  <span className="text-gray-400 font-semibold block mb-0.5">Hobbies:</span>
                  <p className="text-gray-300">{hobbies}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#333333]">
            <button
              type="button"
              onClick={handleNavigateToProfile}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Full Profile</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#262626] hover:bg-[#333333] text-white border border-[#333333] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
