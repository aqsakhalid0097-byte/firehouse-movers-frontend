import React from 'react';
import type { TeamMember } from '../../api/types';

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[220px] hover:scale-[1.01] transition border border-neutral-700/60">
      <div className="flex items-center gap-5">
        <img
          src={member.profile_picture || '/images/user_icon.jpg'}
          alt={member.full_name}
          className="w-24 h-24 rounded-full object-cover border-2 border-white shrink-0 bg-neutral-800"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/user_icon.jpg';
          }}
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-white truncate">{member.full_name}</h2>
          {member.job_title && (
            <p className="text-base font-semibold text-white truncate">{member.job_title}</p>
          )}
          <p className="text-sm text-gray-400 capitalize">
            {member.role_display || member.role || 'No Role'}
          </p>
          {member.joined_formatted && (
            <p className="text-xs text-gray-500 mt-0.5">Joined: {member.joined_formatted}</p>
          )}
          <p className="text-sm text-gray-500 truncate mt-0.5">Email: {member.email}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-700/40">
        <button
          type="button"
          onClick={() => onEdit(member)}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors cursor-pointer shadow-md"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onRemove(member)}
          className="text-sm bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors cursor-pointer shadow-md"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
