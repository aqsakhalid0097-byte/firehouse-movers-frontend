'use client';

import React, { useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ProfileSidebar } from '../features/profile/ProfileSidebar';
import { useTeam, usePeopleDirectory } from '../api/staffPortalApi';
import { AddTeamMemberModal } from '../features/team/AddTeamMemberModal';
import { EditTeamMemberModal } from '../features/team/EditTeamMemberModal';
import { RemoveTeamMemberModal } from '../features/team/RemoveTeamMemberModal';
import { getMediaUrl } from '../utils/media';
import type { TeamMember } from '../api/types';

const defaultRolesList = [
  { value: 'driver', label: 'Driver' },
  { value: 'lead_mover', label: 'Lead Mover' },
  { value: 'mover', label: 'Mover' },
  { value: 'helper', label: 'Helper' },
  { value: 'crew_leader', label: 'Crew Leader' },
  { value: 'station_staff', label: 'Station Staff' },
];

export const TeamPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [selectedRoleInput, setSelectedRoleInput] = useState<string>('');
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);

  const { data, isLoading, error, refetch } = useTeam(activeRoleFilter);
  const { data: peopleData } = usePeopleDirectory();

  // If team members are provided from useTeam, use them, otherwise map people directory
  const teamMembers: TeamMember[] =
    data?.team_members && data.team_members.length > 0
      ? data.team_members
      : (peopleData?.results || []).map((p) => ({
          id: p.id,
          user_id: p.user_id,
          first_name: p.first_name,
          last_name: p.last_name,
          full_name: p.full_name,
          email: p.email || '',
          phone_number: '',
          role: p.role,
          role_display: p.role_display,
          job_title: p.job_title || '',
          start_date: null,
          joined_formatted: null,
          profile_picture: p.profile_picture,
          department_id: p.department_id,
          department_title: p.department_title,
        })).filter((m) => !activeRoleFilter || m.role === activeRoleFilter);

  const roles = data?.roles && data.roles.length > 0 ? data.roles : defaultRolesList;
  const isSeniorManagement = data?.is_senior_management || false;

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveRoleFilter(selectedRoleInput);
  };

  const handleRemoveConfirm = () => {
    refetch();
    setRemovingMember(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Navbar */}
      <Navbar isAuthenticated={true} user={user} onLogout={logout} notificationCount={2} />

      <div className="flex min-h-[calc(100vh-65px)] bg-black">
        {/* Profile Sidebar */}
        <ProfileSidebar activeTab="team" />

        {/* Main Content matching authentication/team_view.html */}
        <main className="flex-1 min-w-0 bg-black p-6 sm:p-10" data-tour-main>
          <div className="max-w-7xl mx-auto">
            {/* Heading matching team_view.html */}
            <h1 className="animate-heading text-3xl font-bold text-red-500 mb-8">Your Team Members</h1>

            {/* + Add Member button matching team_view.html */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-red-500 hover:bg-red-700 px-5 py-2.5 rounded-md text-white font-semibold mb-6 inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Member</span>
            </button>

            {/* Filter Form (if not senior management) */}
            {!isSeniorManagement && (
              <form onSubmit={handleFilter} className="mb-8 flex gap-3 items-center flex-wrap">
                <select
                  value={selectedRoleInput}
                  onChange={(e) => setSelectedRoleInput(e.target.value)}
                  className="px-4 py-2 rounded bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:border-red-500 text-sm cursor-pointer"
                >
                  <option value="">All Roles</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm transition-colors cursor-pointer"
                >
                  Filter
                </button>
              </form>
            )}

            {/* Content Body */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Loading team members...</p>
              </div>
            ) : error && !teamMembers.length ? (
              <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-8 text-center space-y-4 max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Unable to Load Team Members</h3>
                <p className="text-xs text-gray-300">
                  {(error as any)?.message || 'There was an issue connecting to the team service.'}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : teamMembers.length > 0 ? (
              /* Grid matching team_view.html */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => {
                  const avatarSrc = getMediaUrl(member.profile_picture);
                  const displayName = member.full_name || 'Team Member';

                  return (
                    <div
                      key={member.id}
                      className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[220px] hover:scale-[1.01] transition border border-[#333333]"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.endsWith('/images/user_icon.jpg')) {
                              target.src = '/images/user_icon.jpg';
                            }
                          }}
                          className="w-20 h-20 rounded-full object-cover border-2 border-red-500 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-red-500 truncate">{displayName}</h2>
                          <p className="text-gray-300 text-sm font-medium">
                            Role:{' '}
                            <span className="text-white">
                              {member.role_display || member.job_title || 'Staff'}
                            </span>
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Joined: {member.joined_formatted || member.start_date || 'Active'}
                          </p>
                          {member.phone_number && (
                            <p className="text-gray-400 text-xs mt-0.5">{member.phone_number}</p>
                          )}
                          {member.department_title && (
                            <p className="text-red-400/80 text-[11px] mt-1 font-medium">
                              Dept: {member.department_title}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons (Edit & Remove) matching team_view.html */}
                      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-[#3a3a3a]">
                        <button
                          type="button"
                          onClick={() => setEditingMember(member)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemovingMember(member)}
                          className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 italic">No team members found for this criteria.</p>
            )}
          </div>
        </main>
      </div>

      {/* Add Member Modal */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        roles={roles}
        onSuccess={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Member Modal */}
      {editingMember && (
        <EditTeamMemberModal
          isOpen={Boolean(editingMember)}
          member={editingMember}
          roles={roles}
          onClose={() => setEditingMember(null)}
          onSuccess={() => {
            refetch();
            setEditingMember(null);
          }}
        />
      )}

      {/* Remove Member Modal */}
      {removingMember && (
        <RemoveTeamMemberModal
          isOpen={Boolean(removingMember)}
          member={removingMember}
          onClose={() => setRemovingMember(null)}
          onSuccess={handleRemoveConfirm}
        />
      )}
    </div>
  );
};

export default TeamPage;
