import React from "react";
import type { AwardItem } from "../../api/types";
import { getMediaUrl } from "../../utils/media";

interface AwardsColumnProps {
  awards: AwardItem[];
}

export const AwardsColumn: React.FC<AwardsColumnProps> = ({ awards }) => {
  return (
    <div className="space-y-3 w-full">
      <div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Awards</h2>
        <div className="border-b border-red-900/60 w-full" />
      </div>

      <div className="space-y-4 pt-2">
        {awards.length === 0 ? (
          <div className="bg-[#181d24] border border-[#262f3d]/60 rounded-lg p-8 text-center text-gray-400">
            <p className="text-sm font-semibold text-white">No personal awards yet</p>
            <p className="text-xs mt-1">Keep up the exceptional service and achievements will be listed here.</p>
          </div>
        ) : (
          awards.map((award) => {
            const photoUrl = getMediaUrl(award.photo);
            const formattedAmount = typeof award.amount === 'number' ? `$${award.amount}` : (award.amount || '');

            return (
              <div
                key={award.id}
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

                {/* Award Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-red-500 leading-tight">
                    {award.category}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed mt-1">
                    {award.reason}
                  </p>
                  {award.date_award && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      {award.date_award}
                    </p>
                  )}
                  {formattedAmount && (
                    <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-1">
                      {formattedAmount}
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
