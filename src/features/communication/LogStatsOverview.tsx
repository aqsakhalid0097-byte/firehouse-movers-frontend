import React from "react";
import { TrendingUp, CheckCircle2, Clock } from "lucide-react";
import type { CommunicationStats } from "../../api/types";

interface LogStatsOverviewProps {
  stats: CommunicationStats;
}

export const LogStatsOverview: React.FC<LogStatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Total Entries</span>
          <div className="p-2 rounded-md bg-red-500/10 text-red-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</p>
        <p className="text-xs text-gray-400 mt-1">Recorded operational & incident notes</p>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Pending Sign-off</span>
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{stats.unacknowledged}</p>
        <p className="text-xs text-gray-400 mt-1">Unacknowledged communications</p>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Acknowledged</span>
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.acknowledged}</p>
        <p className="text-xs text-gray-400 mt-1">Signed off & confirmed logs</p>
      </div>
    </div>
  );
};
