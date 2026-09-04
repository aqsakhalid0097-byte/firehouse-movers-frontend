import React from 'react';
import { Building, Crown, Users, User } from 'lucide-react';

import { getMediaUrl } from '../../utils/media';

export interface Teammate {
  id: number | string;
  userId?: number | string;
  name: string;
  role: string;
  jobTitle?: string;
  avatarUrl?: string;
}

interface ProfileTeamSectionProps {
  department?: string;
  manager?: Teammate | null;
  teammates?: Teammate[];
  teamMembers?: Teammate[];
  onSelectMember?: (userId: number | string) => void;
}

export const ProfileTeamSection: React.FC<ProfileTeamSectionProps> = ({
  department = 'Operations & Moving Services',
  manager,
  teammates = [],
  teamMembers = [],
  onSelectMember,
}) => {
  return (
    <div className="space-y-8" id="profile-team">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Card */}
        <section className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333333] hover:border-red-500/30 transition-colors shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold text-red-500">Department</h3>
          </div>
          <div className="bg-[#262626] p-4 rounded-xl border border-[#333333] flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white mb-1">{department}</h4>
              <p className="text-xs text-gray-400">Assigned Department</p>
            </div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30 flex items-center gap-1">
              <User className="w-3 h-3" /> Member
            </span>
          </div>
        </section>

        {/* Team Manager Card */}
        <section className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333333] hover:border-red-500/30 transition-colors shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold text-red-500">Team Manager</h3>
          </div>
          {manager ? (
            <div
              onClick={() => manager.userId && onSelectMember?.(manager.userId)}
              className={`flex items-center gap-4 bg-[#262626] p-4 rounded-xl border border-[#333333] ${
                manager.userId ? 'cursor-pointer hover:border-red-500/50 hover:bg-[#2e2e2e] transition-all' : ''
              }`}
            >
              <img
                src={getMediaUrl(manager.avatarUrl)}
                alt="Manager"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/user_icon.jpg')) {
                    target.src = '/images/user_icon.jpg';
                  }
                }}
                className="w-12 h-12 rounded-lg object-cover shadow-md border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-white truncate">{manager.name}</h4>
                <p className="text-xs text-gray-300 truncate">{manager.jobTitle || manager.role}</p>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full border border-red-500/30 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Manager
              </span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No Manager Assigned</p>
          )}
        </section>
      </div>

      {/* Direct Reports / Team Members Section (For Managers) */}
      {teamMembers.length > 0 && (
        <section className="bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl border border-[#333333] hover:border-red-500/30 transition-colors shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold text-red-500">Direct Team Members ({teamMembers.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((mate) => (
              <div
                key={mate.id}
                onClick={() => mate.userId && onSelectMember?.(mate.userId)}
                className={`flex items-center gap-3 p-3.5 bg-[#262626] rounded-xl hover:bg-[#333333] transition-colors border border-[#333333] ${
                  mate.userId ? 'cursor-pointer hover:border-red-500/50' : ''
                }`}
              >
                <img
                  src={getMediaUrl(mate.avatarUrl)}
                  alt={mate.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/user_icon.jpg')) {
                      target.src = '/images/user_icon.jpg';
                    }
                  }}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{mate.name}</p>
                  <p className="text-xs text-gray-400 truncate">{mate.jobTitle || mate.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Teammates Section */}
      <section className="bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl border border-[#333333] hover:border-red-500/30 transition-colors shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-red-500" />
          <h3 className="text-xl font-bold text-red-500">Teammates</h3>
        </div>

        {teammates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teammates.map((mate) => (
              <div
                key={mate.id}
                onClick={() => mate.userId && onSelectMember?.(mate.userId)}
                className={`flex items-center gap-3 p-3.5 bg-[#262626] rounded-xl hover:bg-[#333333] transition-colors border border-[#333333] ${
                  mate.userId ? 'cursor-pointer hover:border-red-500/50' : ''
                }`}
              >
                <img
                  src={getMediaUrl(mate.avatarUrl)}
                  alt={mate.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/user_icon.jpg')) {
                      target.src = '/images/user_icon.jpg';
                    }
                  }}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{mate.name}</p>
                  <p className="text-xs text-gray-400 truncate">{mate.jobTitle || mate.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No teammates yet.</p>
        )}
      </section>
    </div>
  );
};
