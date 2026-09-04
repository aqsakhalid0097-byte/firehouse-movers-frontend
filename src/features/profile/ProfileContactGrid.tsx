import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { ProfileData } from './ProfileHeader';

interface ProfileContactGridProps {
  profile: ProfileData;
}

export const ProfileContactGrid: React.FC<ProfileContactGridProps> = ({ profile }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center gap-3 bg-[#262626] p-3.5 rounded-xl border border-[#333333] hover:border-gray-700 transition-colors">
        <div className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-300 shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-medium">Email</p>
          <p className="text-sm font-semibold text-white truncate">{profile.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#262626] p-3.5 rounded-xl border border-[#333333] hover:border-gray-700 transition-colors">
        <div className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-300 shrink-0">
          <Phone className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-medium">Work Phone</p>
          <p className="text-sm font-semibold text-white">{profile.phone || 'Not Set'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#262626] p-3.5 rounded-xl border border-[#333333] hover:border-gray-700 transition-colors">
        <div className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-300 shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-medium">Location</p>
          <p className="text-sm font-semibold text-white">{profile.location || 'Not Set'}</p>
        </div>
      </div>
    </div>
  );
};
