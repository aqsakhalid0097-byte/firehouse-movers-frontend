import React from "react";
import type { PeopleDirectoryMember } from "../../api/types";
import { getMediaUrl } from "../../utils/media";

interface PeopleGridProps {
  people: PeopleDirectoryMember[];
  onSelectMember?: (member: PeopleDirectoryMember) => void;
}

export const PeopleGrid: React.FC<PeopleGridProps> = ({ people, onSelectMember }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {people.map((person) => {
        const displayName = person.full_name || `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Employee';
        const displayAvatar = getMediaUrl(person.profile_picture);
        const displayTitle = person.job_title || person.department_title || '';
        const displayRole = person.role_display || person.role || '';

        return (
          <div
            key={person.id || person.user_id}
            onClick={() => onSelectMember && onSelectMember(person)}
            className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-7 hover:border-red-500 hover:scale-105 transition-all duration-200 flex flex-col items-center text-center cursor-pointer group"
          >
            {/* Centered Circular Avatar (+20% size) */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3.5 bg-[#2e3746] flex items-center justify-center shrink-0 shadow-md border border-white/10 group-hover:border-red-500/50 transition-colors">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/user_icon.jpg')) {
                      target.src = '/images/user_icon.jpg';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-[#606f85]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {/* Name */}
            <h3 className="font-bold text-white text-base sm:text-[17px] leading-tight mb-1 truncate w-full group-hover:text-red-400 transition-colors">
              {displayName}
            </h3>

            {/* Position / Title */}
            {displayTitle && (
              <p className="text-xs sm:text-[13px] text-gray-300 truncate w-full mb-0.5">
                {displayTitle}
              </p>
            )}

            {/* Base Role */}
            {displayRole && (
              <p className="text-[11px] sm:text-xs text-gray-400 capitalize truncate w-full">
                {displayRole}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
