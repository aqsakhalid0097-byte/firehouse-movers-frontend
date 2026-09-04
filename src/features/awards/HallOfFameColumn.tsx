import React from "react";
import type { HallOfFameItem } from "../../api/types";
import { getMediaUrl } from "../../utils/media";

interface HallOfFameColumnProps {
  entries: HallOfFameItem[];
}

export const HallOfFameColumn: React.FC<HallOfFameColumnProps> = ({ entries }) => {
  return (
    <div className="space-y-3 w-full">
      <div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Hall of Fame</h2>
        <div className="border-b border-red-900/60 w-full" />
      </div>

      <div className="space-y-4 pt-2">
        {entries.length === 0 ? (
          <div className="bg-[#181d24] border border-[#262f3d]/60 rounded-lg p-8 text-center text-gray-400">
            <p className="text-sm font-semibold text-white">No Hall of Fame honorees yet</p>
            <p className="text-xs mt-1">Honorees recognized for leadership and excellence will appear here.</p>
          </div>
        ) : (
          entries.map((entry) => {
            const photoUrl = getMediaUrl(entry.photo);
            const formattedDate = entry.created_at
              ? new Date(entry.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '';

            return (
              <div
                key={entry.id}
                className="bg-[#181d24] border border-[#262f3d]/60 hover:border-red-500/40 rounded-lg p-5 flex items-center gap-4 sm:gap-5 transition-all shadow-md group w-full"
              >
                {/* Avatar / Placeholder Icon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-none bg-[#cbd5e1] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {photoUrl ? (
                    <img src={photoUrl} alt="" className="w-full h-full object-cover rounded-none" />
                  ) : (
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 text-[#94a3b8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>

                {/* Hall of Fame Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-red-500 leading-tight">
                    {entry.employee_name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed mt-1">
                    {entry.description}
                  </p>
                  {formattedDate && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      Inducted: {formattedDate}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
