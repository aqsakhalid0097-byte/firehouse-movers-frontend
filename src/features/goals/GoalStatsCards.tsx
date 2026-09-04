import React from "react";
import { Target, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import type { GoalSummaryStats } from "./types";

interface GoalStatsCardsProps {
  stats: GoalSummaryStats;
}

export const GoalStatsCards: React.FC<GoalStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Total Goals</span>
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalGoals}</p>
        <p className="text-xs text-gray-400 mt-1">Active KPIs this quarter</p>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Achieved</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.achievedCount}</p>
        <p className="text-xs text-gray-400 mt-1">Goals fully met</p>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">On Track</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-sky-400">{stats.onTrackCount}</p>
        <p className="text-xs text-gray-400 mt-1">Meeting target pace</p>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Avg Completion</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.avgCompletionRate}%</p>
        <p className="text-xs text-gray-400 mt-1">Overall progress metric</p>
      </div>
    </div>
  );
};
