import React from 'react';
import { BadgeCheck, Calendar, IdCard, Edit, UserCheck } from 'lucide-react';
import { ProfileContactGrid } from './ProfileContactGrid';

import { getMediaUrl } from '../../utils/media';

export interface ProfileData {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  jobTitle: string;
  startDate: string;
  tenure?: string;
  hobbies?: string;
  favouriteQuote?: string;
  avatarUrl: string;
  isOwnProfile?: boolean;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  onEditClick?: () => void;
  onViewManagerClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditClick,
  onViewManagerClick,
}) => {
  const avatarSrc = getMediaUrl(profile.avatarUrl);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#262626] to-[#1a1a1a] border border-[#333333] shadow-2xl p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
          <img
            src={avatarSrc}
            alt="Profile Avatar"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/images/user_icon.jpg')) {
                target.src = '/images/user_icon.jpg';
              }
            }}
            className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover shadow-xl border-2 border-white/10 hover:border-red-500/40 transition-all bg-neutral-900"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="animate-heading text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 tracking-tight">
              {profile.firstName} {profile.lastName}
            </h1>
            <h2 className="text-lg lg:text-xl font-bold text-gray-400 mt-1">
              {profile.jobTitle || profile.role}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-[#262626] px-3.5 py-1.5 rounded-full border border-[#333333]">
              <IdCard className="w-4 h-4 text-gray-400" />
              <span className="text-white font-semibold">ID: {profile.id}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#262626] px-3.5 py-1.5 rounded-full border border-[#333333]">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-white font-semibold">
                {profile.tenure ? `Tenure: ${profile.tenure}` : `Joined ${profile.startDate}`}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#262626] px-3.5 py-1.5 rounded-full border border-[#333333]">
              <BadgeCheck className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium capitalize">{profile.role}</span>
            </div>
          </div>
        </div>
      </div>

      <ProfileContactGrid profile={profile} />

      <div className="mt-6 flex flex-wrap gap-3">
        {profile.isOwnProfile !== false && onEditClick && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 bg-[#262626] hover:bg-red-600 hover:border-red-600 px-4 py-2 rounded-lg text-white font-medium text-sm transition-all border border-[#333333] cursor-pointer shadow-md"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}

        <button
          onClick={onViewManagerClick}
          className="flex items-center gap-2 bg-[#262626] hover:bg-slate-800 px-4 py-2 rounded-lg text-white font-medium text-sm transition-all border border-[#333333] cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-gray-300" />
          <span>View Team & Manager</span>
        </button>
      </div>
    </div>
  );
};
