import React from 'react';
import { Download } from 'lucide-react';
import type { CompanyManual } from './data/coursesData';

export interface CompanyManualCardProps {
  manual: CompanyManual;
}

export const CompanyManualCard: React.FC<CompanyManualCardProps> = ({ manual }) => {
  return (
    <div className="resource-card bg-[#1a1a1a] border border-gray-700/80 rounded-xl p-6 hover:border-red-500 transition-all duration-300 flex flex-col justify-between h-full shadow-lg">
      <div className="card-content flex-1 flex flex-col mb-3">
        <div className="flex items-start gap-3.5">
          <svg className="w-[1.85rem] h-[1.85rem] text-[#ef4444] fill-current shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
          </svg>
          <div>
            <h3 className="text-[1.125rem] font-bold text-white mb-1.5 leading-snug tracking-wide">
              {manual.title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-[0.8125rem] leading-snug font-normal">
              {manual.description}
            </p>
          </div>
        </div>
      </div>

      <div className="card-action mt-auto pt-3 flex justify-center">
        <a
          href={manual.url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="px-5 py-2.5 bg-[#ef4444] hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
};
